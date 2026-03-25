import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { Loader2, Store, ArrowLeft } from "lucide-react";

import OrderCatalog from "./OrderCatalog";
import OrderCart from "./OrderCart";

export default function CreateOrderView() {
  const { id: providerId } = useParams();
  const { company } = useAuth();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProviderAndCatalog = async () => {
      try {
        if (isMounted) setLoading(true);

        // 1. Obtener datos del proveedor
        const { data: providerData } = await supabase
          .from("companies")
          .select("legal_name, rut")
          .eq("id", providerId)
          .single();

        if (providerData && isMounted) setProvider(providerData);

        // 2. Obtener catálogo del proveedor
        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .eq("company_id", providerId)
          .order("created_at", { ascending: false });

        if (productsData && isMounted) setProducts(productsData);
      } catch (error) {
        if (isMounted) console.error("Error cargando catálogo:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (providerId) {
      fetchProviderAndCatalog();
    } else {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [providerId]);

  // Manejo del Carrito
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      // 1. Calculamos el total de forma segura (forzando que sean números)
      const totalAmount = cart.reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0,
      );

      // 2. Insertamos el pedido (como transacción PENDIENTE)
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .insert([
          {
            provider_id: providerId,
            merchant_id: company.id,
            issuer_id: company.id, // Lo emite el comerciante que está comprando
            type: "INVOICE",
            amount: totalAmount,
            status: "PENDING",
          },
        ])
        .select();

      if (txError) throw txError;

      // Extraemos el ID del array devuelto
      const transactionId = txData[0]?.id;
      if (!transactionId)
        throw new Error("No se pudo obtener el ID del pedido generado.");

      // 3. Insertamos los productos dentro de ese pedido
      const orderItems = cart.map((item) => ({
        transaction_id: transactionId,
        product_id: item.id,
        quantity: Number(item.quantity) || 1,
        unit_price: Number(item.price) || 0,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 4. Redirigimos al historial de pedidos
      navigate(`/panel/pedidos`);
    } catch (error) {
      console.error("Error al emitir pedido:", error);
      alert(
        `Error al procesar: ${error.message || error.details || "Problema de conexión"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#111] mb-4" size={32} />
        <p className="text-[11px] font-bold text-[#111] uppercase tracking-[0.2em]">
          Cargando Catálogo...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col animate-in fade-in duration-300">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#111] pb-6 mb-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#666] hover:text-[#111] transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Volver
            </span>
          </button>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-[#111] flex items-center gap-3">
            <Store size={24} strokeWidth={2} />
            Nuevo Pedido a {provider?.legal_name || "Proveedor"}
          </h1>
          <p className="text-[11px] font-semibold text-[#666] uppercase tracking-[0.1em] mt-1">
            Selecciona los productos y cantidades para emitir la orden.
          </p>
        </div>
      </div>

      {/* Layout de 2 columnas */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Columna Izquierda: Catálogo (Ocupa más espacio) */}
        <div className="w-full lg:w-2/3">
          <OrderCatalog products={products} onAddToCart={handleAddToCart} />
        </div>

        {/* Columna Derecha: Carrito (Sticky) */}
        <div className="w-full lg:w-1/3">
          <OrderCart
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onSubmitOrder={handleSubmitOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

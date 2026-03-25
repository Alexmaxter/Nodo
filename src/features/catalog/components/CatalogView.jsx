import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { Loader2, Package, AlertCircle, CheckCircle2 } from "lucide-react";

import CatalogHeader from "./CatalogHeader";
import ProductList from "./ProductList";
import ProductModal from "./ProductModal";

export default function CatalogView() {
  const { company } = useAuth();

  // Estados Globales
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = async () => {
    if (!company?.id) return;
    try {
      if (isMounted.current) setLoading(true);

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      // Solo actualiza el estado si el componente no se ha destruido
      if (isMounted.current) setProducts(data || []);
    } catch (err) {
      if (isMounted.current)
        setError("No se pudo cargar el catálogo de productos.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchProducts();

    // Función de limpieza real al cambiar de vista
    return () => {
      isMounted.current = false;
    };
  }, [company]);

  // Manejadores
  const handleOpenNew = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleSaved = () => {
    handleCloseModal();
    fetchProducts(); // <-- Quítale el "true" que tenía antes
    setSuccessMsg("Catálogo actualizado con éxito.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("¿Eliminar este producto permanentemente?")) return;
    try {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      if (deleteError) throw deleteError;
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setSuccessMsg("Producto eliminado.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError("No se pudo eliminar el producto.");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())),
  );

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
  // Manejador para eliminar un producto
  const handleDeleteProduct = async (productId) => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de eliminar este producto del catálogo?",
    );
    if (!isConfirmed) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      // Recarga la página para que desaparezca el producto de la lista
      // (Si ya tienes una función como fetchProducts(), puedes llamarla en lugar de reload)
      window.location.reload();
    } catch (err) {
      console.error("Error al eliminar producto:", err.message);
      alert("Hubo un error al intentar eliminar el producto.");
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      {" "}
      {/* Alertas dinámicas */}
      {(error || successMsg) && (
        <div className="mb-6 flex flex-col gap-2">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 flex items-center gap-3">
              <AlertCircle size={16} />{" "}
              <p className="text-[10px] font-bold uppercase tracking-widest">
                {error}
              </p>
            </div>
          )}
          {successMsg && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 flex items-center gap-3">
              <CheckCircle2 size={16} />{" "}
              <p className="text-[10px] font-bold uppercase tracking-widest">
                {successMsg}
              </p>
            </div>
          )}
        </div>
      )}
      {/* Cabecera solo con controles */}
      <CatalogHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewProduct={() => openModal()}
      />
      {/* Lista de productos */}
      <ProductList
        products={filteredProducts}
        onEdit={(p) => openModal(p)}
        onDelete={handleDeleteProduct}
      />
      {/* Modal */}
      {isModalOpen && (
        <ProductModal
          productToEdit={productToEdit}
          onClose={handleCloseModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

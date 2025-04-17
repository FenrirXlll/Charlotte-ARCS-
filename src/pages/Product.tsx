
import React from 'react';
import { useParams } from 'react-router-dom';
import WhatsAppButton from '@/components/WhatsAppButton';

const Product = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Detalles del Producto {id}</h1>
      <p>Esta página será implementada próximamente.</p>
      <WhatsAppButton />
    </div>
  );
};

export default Product;

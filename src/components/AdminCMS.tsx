'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Upload, Link as LinkIcon, Trash2 } from 'lucide-react';

export default function AdminCMS() {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  // Holds up to 5 image strings (either URL links or Base64 file uploads)
  const [images, setImages] = useState<string[]>(['', '', '', '', '']);

  // Handle direct file upload from computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = reader.result as string;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL text input
  const handleUrlChange = (value: string, index: number) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  // Clear single image slot
  const clearImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = '';
    setImages(newImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validImages = images.filter((img) => img.trim() !== '');

    if (validImages.length === 0) {
      alert('Please provide at least 1 product image (either upload a file or enter a URL).');
      return;
    }

    const newProduct = {
      title,
      price: parseFloat(price),
      description,
      images: validImages,
    };

    console.log('Saved Product:', newProduct);
    alert('Product saved successfully!');

    // Reset form
    setTitle('');
    setPrice('');
    setDescription('');
    setImages(['', '', '', '', '']);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <p className="text-red-600 font-semibold">Access Denied: Administrator permissions required.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Admin Product Management</h1>
        <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-3 py-1 rounded-full">
          Administrator Mode
        </span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-slate-800">Add New Product</h2>

        {/* Product Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Product Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="e.g. Kneeding machine"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price (£)</label>
          <input
            type="number"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="189.99"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Enter product description..."
          />
        </div>

        {/* Product Images (Upload Files or URLs) */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Product Images (1 to 5 — Choose File OR Paste URL)
          </label>

          <div className="space-y-3">
            {images.map((img, index) => (
              <div key={index} className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Image {index + 1} {index === 0 ? '(Required)' : '(Optional)'}</span>
                  {img && (
                    <button
                      type="button"
                      onClick={() => clearImage(index)}
                      className="text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Option A: Upload Local File */}
                  <div className="w-full sm:w-auto">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors shadow-sm w-full sm:w-auto">
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, index)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <span className="text-xs text-slate-400 font-bold">OR</span>

                  {/* Option B: Paste URL */}
                  <div className="flex-1 w-full relative">
                    <input
                      type="text"
                      value={img.startsWith('data:') ? '' : img}
                      onChange={(e) => handleUrlChange(e.target.value, index)}
                      placeholder={img.startsWith('data:') ? 'Image uploaded from file' : `Paste Image URL ${index + 1}...`}
                      disabled={img.startsWith('data:')}
                      className="w-full rounded-md border border-slate-300 pl-8 pr-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-100"
                    />
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
                  </div>

                  {/* Thumbnail Preview */}
                  {img && (
                    <div className="h-9 w-9 rounded border overflow-hidden bg-slate-200 flex-shrink-0">
                      <img src={img} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-slate-900 text-white font-semibold py-2.5 rounded-md hover:bg-slate-800 transition-colors shadow"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
import { useState, useMemo } from "react";
import { ethers } from "ethers";

const INITIAL = { productId: "", productName: "", quantity: "", price: "", receiverAddress: "" };

function validate(form) {
  const errors = {};
  if (!form.productId.trim())    errors.productId = "Required";
  if (!form.productName.trim())  errors.productName = "Required";
  if (!form.quantity || isNaN(form.quantity) || +form.quantity <= 0) errors.quantity = "Must be a positive number";
  if (!form.price    || isNaN(form.price)    || +form.price    <= 0) errors.price    = "Must be a positive number";
  if (!ethers.isAddress(form.receiverAddress)) errors.receiverAddress = "Invalid Ethereum address";
  return errors;
}

export default function ProductForm({ onSubmit }) {
  const [form, setForm]     = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const total = useMemo(() => {
    const q = parseFloat(form.quantity);
    const p = parseFloat(form.price);
    return (!isNaN(q) && !isNaN(p)) ? (q * p).toFixed(4) : "0.0000";
  }, [form.quantity, form.price]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ ...form, total });
  };

  const Field = ({ label, name, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400 uppercase tracking-wide">{label}</label>
      <input name={name} type={type} value={form[name]} onChange={handleChange}
        placeholder={placeholder}
        className={`bg-gray-800 border rounded-lg px-3 py-2 text-sm text-white outline-none
          focus:border-orange-500 ${errors[name] ? "border-red-500" : "border-gray-700"}`}/>
      {errors[name] && <span className="text-xs text-red-400">{errors[name]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
      <h2 className="text-white font-medium">Product Transaction</h2>
      <Field label="Product ID"   name="productId"       placeholder="e.g. PROD-001"/>
      <Field label="Product Name" name="productName"     placeholder="e.g. Laptop"/>
      <Field label="Quantity"     name="quantity" type="number" placeholder="1"/>
      <Field label="Price (ETH)"  name="price"   type="number" placeholder="0.01"/>
      <Field label="Receiver Address" name="receiverAddress" placeholder="0x..."/>

      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
        <span className="text-sm text-gray-400">Total</span>
        <span className="text-white font-mono font-medium">{total} ETH</span>
      </div>

      <button type="submit"
        className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl">
        Preview & Sign →
      </button>
    </form>
  );
}

'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка отправки');
      }

      setStatus({ type: 'success', message: '✅ Письмо отправлено!' });
      setFormData({ firstName: '', lastName: '', age: '' });
    } catch (err) {
      setStatus({ type: 'error', message: `❌ ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 text-white"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Контактная форма</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Имя</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Введите имя"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Фамилия</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Введите фамилию"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Возраст</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          min="1"
          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Введите возраст"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold rounded-lg transition duration-200"
      >
        {loading ? 'Отправка...' : 'Отправить'}
      </button>

      {status.message && (
        <p className={`mt-4 text-center ${status.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
          {status.message}
        </p>
      )}
    </form>
  );
}
'use client';

import { useState } from 'react';

export default function SendMessageForm() {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message }),
      });

      const data = await res.json();
      setResponse(data);

      if (data.success) {
        alert('Message sent successfully!');
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form
      onSubmit={sendMessage}
      className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
    >
      <input
        type="text"
        placeholder="Recipient's phone number"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        required
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        className="w-full mb-4 p-2 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Send Message
      </button>

      {response && (
        <p
          className={`mt-4 p-3 rounded ${
            response.success
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {response.success
            ? `Message SID: ${response.sid}`
            : `Error: ${response.error}`}
        </p>
      )}
    </form>
  );
}

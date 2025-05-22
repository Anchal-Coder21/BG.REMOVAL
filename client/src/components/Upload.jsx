import React from 'react';
import { assets } from '../assets/assets';

const Upload = () => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Process the file (e.g., upload or display preview)
      console.log('Selected file:', file.name);
    }
  };

  return (
    <div className="p-16 mt-16">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent">
        See the magic. Try now
      </h1>

      <div className="text-center mb-24">
        <input
          type="file"
          name="file"
          id="upload2"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        <label
          htmlFor="upload2"
          aria-label="Upload your image"
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-500 m-auto hover:scale-105 transition-all duration-700"
        >
          <img width={20} src={assets.upload_btn_icon} alt="Upload Icon" />
          <p className="text-white text-sm">Upload your image</p>
        </label>
      </div>
    </div>
  );
};

export default Upload;


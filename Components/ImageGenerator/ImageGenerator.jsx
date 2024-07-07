import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/robot.jpeg';

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState("/");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const fetchImage = async () => {
    if (inputRef.current.value === "") {
      console.log("Input is empty");
      return;
    }
    setLoading(true);

    try {
      console.log("Fetching image with prompt:", inputRef.current.value);

      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "apikey",
          "User-Agent": "Chrome",
        },
        body: JSON.stringify({
          prompt: inputRef.current.value,
          n: 1,
          size: "512x512",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const data = await response.json();
      console.log("API response data:", data);

      if (data && data.data && data.data.length > 0) {
        setImage_url(data.data[0].url);
      } else {
        throw new Error('No image URL returned from API.');
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setImage_url("/"); // Reset to default image on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='ai-image-generator'>
      <div className="header">AI image<span> generator</span></div>
      <div className='img_loading'>
        <div className='image'>
          <img src={image_url === "/" ? default_image : image_url} alt='' />
        </div>
        <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
        <div className={loading ? "loading-text" : "display-none"}>Loading...</div>
      </div>
      <div className="search-box">
        <input type='text' ref={inputRef} className='search-input' placeholder='Explain Your Thoughts' />
        <div className="generate-btn" onClick={fetchImage}>Generate</div>
      </div>
    </div>
  );
};

export default ImageGenerator;

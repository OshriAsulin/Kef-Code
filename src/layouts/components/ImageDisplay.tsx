import React from 'react';

const ImageDisplay = ({ imageUrl } : any) => {
  return <div className="max-h-[20rem] max-w-[45rem]"> <img src={imageUrl} alt="Image" /> </div>;
};

export default ImageDisplay;
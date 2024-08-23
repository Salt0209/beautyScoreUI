import React from "react";

export default function ImportImage(props, ref) {
  const { handleSubmit, handleFileChange, image, dataAge, widthF, heightF,width, height, setWidthF, setHeightF, hoveredIndex} = props;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Choose an image:
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </label>
        <div className="image-upload-container">
          {image && (
            <div className="image-wrapper">
              <img
                src={image}
                alt="Preview"
                className="image-preview"
                onLoad={(e) => {
                  const imgElement = e.target;
                  setWidthF(imgElement.width);
                  setHeightF(imgElement.height);
                }}
              />
              {dataAge &&
                dataAge.faces &&
                dataAge.faces.map((face, index) => (
                  <div
                    className={`face-frame estest_faceframe ${
                      hoveredIndex === index ? "hovered" : ""
                    }`}
                    key={index}
                    data-index={index}
                    style={{
                      top: `${(face.bbox[1] * heightF) / height}px`,
                      left: `${(face.bbox[0] * widthF) / width}px`,
                      width: `${
                        ((face.bbox[2] - face.bbox[0]) * widthF) / width
                      }px`,
                      height: `${
                        ((face.bbox[3] - face.bbox[1]) * heightF) / height
                      }px`,
                    }}
                  >
                    <div>{index + 1}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

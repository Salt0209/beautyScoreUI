import React, {useState} from "react";
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
const { Dragger } = Upload;



export default function ImportImage(props, ref) {
  // eslint-disable-next-line
  const { handleFileChange, image, dataAge, widthF, heightF,width, height, setWidthF, setHeightF, hoveredIndex} = props;
  const [fileList, setFileList] = useState([]);
  const propDragger = {
    name: "file",
    multiple: false,
    fileList,
    accept: "image/*",
    beforeUpload: (file) => {
      handleFileChange(file); 
      return false;
    },
    onChange(info) {
      // Cập nhật lại danh sách tệp khi có thay đổi
      setFileList(info.fileList.slice(-1)); // Giữ lại tệp cuối cùng
    },
    onDrop(e) {
      setFileList([]);
    },
  };
  return (
    <div>
      <div className="ms-2">
        <div className="image-upload-container mt-5">
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
        <Dragger {...propDragger}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
      </div>
    </div>
  );
}

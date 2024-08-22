import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import ImportImage from "./ImportImage";

function App() {
  // Quản lý state cho file hình ảnh
  const [selectedFile, setSelectedFile] = useState(null);
  // Quản lý state cho dữ liệu nhận được từ API
  const [dataAge, setDataAge] = useState(null);
  const [dataQuality, setDataQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  // Preview ảnh
  const [image, setImage] = useState(null);
  // Kích thước thực tế của ảnh
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  // Kích thước khung ảnh
  const [heightF, setHeightF] = useState(0);
  const [widthF, setWidthF] = useState(0);
  // Trạng thái hover khuôn mặt
  const [hoveredIndex, setHoveredIndex] = useState(null);
  useEffect(() => {}, [height, width]);

  // Hàm xử lý khi người dùng chọn hình ảnh
  const handleFileChange = (e) => {
    // Reset data
    setDataAge(null);
    setDataQuality(null);

    const file = e.target.files[0];
    if (file) {
      // Preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);

        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);

      // Set file để gửi form
      setSelectedFile(e.target.files[0]);
    }
  };
  // Hàm xử lý khi người dùng submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form submit mặc định

    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);

      // Gọi api đoán tuổi
      const res_age = await axios.post(
        "http://localhost:8000/api/age/",
        formData
      );

      const result_age = res_age.data;
      console.log("Success Age Recognize:", result_age);
      setDataAge(result_age);

      // Gọi api chấm điểm hình ảnh
      const res_quality_ugc = await axios.post(
        "http://localhost:8000/api/quality_ugc/",
        formData
      );

      const result_quality_ugc = res_quality_ugc.data;
      console.log("Success Quality ugc:", result_quality_ugc);
      setDataQuality(result_quality_ugc);

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Hàm toggle hover
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Switch case giá trị đánh giá chất lượng ảnh ugc
  const renderSwitch = (param) => {
    switch (param) {
      case 1:
        return "very bad";
      case 2:
        return "bad";
      case 3:
        return "normal";
      case 4:
        return "good";
      case 5:
        return "excellent";
      default:
        return "unknown";
    }
  };

  return (
    <>
    <ImportImage
       handleSubmit = {handleSubmit}
       handleFileChange = {handleFileChange}
       image = {image}
       dataAge = {dataAge}
    />
      <div>
        {/* render the detail */}
        {loading && <>Loading...</>}
        {dataAge && dataAge.faces && dataQuality && dataQuality.quality ? (
          <div>
            <div>
              <h1>
                Quality Score: {(dataQuality.quality.score * 100).toFixed(1)} %
              </h1>
              <p>
                <strong>
                  This photo is {renderSwitch(dataQuality.quality.class)}
                </strong>{" "}
              </p>
            </div>

            <h1>We found {dataAge.faces.length} persons at the picture</h1>
            {dataAge &&
              dataAge.faces &&
              dataAge.faces.map((face, index) => (
                <div key={index}>
                  <button
                    data-faceindex={index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    Face {index + 1}
                  </button>
                  <p>
                    <strong>Bounding Box:</strong> {face.bbox.join(", ")}
                  </p>
                  <p>
                    <strong>Score:</strong> {face.score}
                  </p>
                  <p>
                    <strong>Age:</strong> {face.age}
                  </p>
                  <p>
                    <strong>Class:</strong> {face.class}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <p>Try out the pre-trained Everypixel models in action!</p>
        )}
      </div>
    </>
  );
}

export default App;

import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import ImportImage from "./ImportImage";

function App() {
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

  // Hàm xử lý khi người dùng chọn hình ảnh
  const handleFileChange = (e) => {
    // Reset data
    setDataAge(null);
    setDataQuality(null);

    const file = e;
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

      // Gửi form
      handleSubmit(e);
    }
  };
  // Hàm xử lý khi người dùng submit form
  const handleSubmit = async (e) => {
    const formData = new FormData();
    formData.append("image", e);

    try {
      setLoading(true);

      // Gọi api đoán tuổi
      const res_age = await axios.post(
        "https://mthuan222.pythonanywhere.com/api/age/",
        formData
      );

      const result_age = res_age.data;
      //console.log("Success Age Recognize:", result_age);
      setDataAge(result_age);

      // Gọi api chấm điểm hình ảnh
      const res_quality_ugc = await axios.post(
        "https://mthuan222.pythonanywhere.com/api/quality_ugc/",
        formData
      );

      const result_quality_ugc = res_quality_ugc.data;
      //console.log("Success Quality ugc:", result_quality_ugc);
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
    <div className="body flex flex-wrap">
      <div className="import-image flex-initial">
        <ImportImage
            handleSubmit={handleSubmit}
            handleFileChange={handleFileChange}
            image={image}
            dataAge={dataAge}
            widthF={widthF}
            heightF={heightF}
            width={width}
            height={height}
            setWidthF={setWidthF}
            setHeightF={setHeightF}
            hoveredIndex = {hoveredIndex}
          />
      </div>
      <div className="result flex-1">
        {/* render the detail */}
        {loading && <div className="mt-5">Loading...</div>}
        {(dataAge && dataAge.faces) || (dataQuality && dataQuality.quality) ? (
          <div>
            <div>
              {dataQuality && (
                <>
                  <p className="text-4xl font-bold mt-5">
                    Quality Score: {(dataQuality.quality.score * 100).toFixed(1)} %
                  </p>
                  <p className="text-xl font-semibold my-2">
                      This photo is {renderSwitch(dataQuality.quality.class)}
                  </p>
                </>
              )}
            </div>

            {dataAge && dataAge.faces && (
              <>
              <p className="text-2xl font-semibold my-2">We found {dataAge.faces.length} persons at the picture!</p>
              {dataAge.faces.map((face, index) => (
                <div key={index}
                    data-faceindex={index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    className="flex w-96 border-green-400 border-x-4 border-e-4
                      border-y-2
                     hover:border-purple-600 p-2"
                >
                  <span className="flex-1">Person {index + 1}</span>
                  <span className="flex-initial">
                    <strong>Age:</strong> {face.age.toFixed(0)}
                  </span>
                </div>
              ))}
              </>
            )}
          </div>
        ) : (
          <p className="text-2xl font-bold mt-5">Try out the pre-trained Everypixel models in action!</p>
        )}
      </div>
    </div>
  );
}

export default App;

// RecipesHeroInlineAnimated.jsx
import React, { useEffect, useState, useRef } from "react";

const API_BASE = "http://localhost:1337";

const RecipesHeroInlineAnimated = () => {
  const [files, setFiles] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/upload/files`)
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error(err));
  }, []);

  // viewport observer for desktop animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const kookpic = files.find((f) => f.name === "kookpic1-1.png");
  const first = files.find((f) => f.name === "first_1.jpg");
  const second = files.find((f) => f.name === "second_2.jpg");
  const third = files.find((f) => f.name === "third_3.jpg");

  const thumbs = [first, second, third].filter(Boolean);

  const outerStyle = {
    backgroundColor: "#e60012",
    padding: "40px 16px",
    display: "flex",
    justifyContent: "center",
  };

  const innerStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    width: isMobile ? "100%" : "75%",
    maxWidth: "1200px",
    padding: "24px 20px",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "24px",
    boxSizing: "border-box",
  };

  const leftStyle = {
    flex: 1,
  };

  const rightStyle = {
  flex: 1,
  display: isMobile ? "none" : "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "visible",        // allow image to go outside white div
  position: "relative",       // parent for the image offset
};

  const titleStyle = {
    fontFamily: "Arial, sans-serif",
    fontWeight: 700,
    fontSize: isMobile ? "28px" : "40px",
    margin: "0 0 24px 0",
    color: "#e60012",
    lineHeight: 1.1,
  };

  const titleSpanStyle = {
    display: "block",
    color: "#e60012",
  };

  const gridStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "16px",
    flexWrap: isMobile ? "nowrap" : "nowrap",
  };

  const cardStyle = {
    flex: isMobile ? "1 1 auto" : "0 0 190px",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  };

  const imgWrapperStyle = {
    borderRadius: "4px",
    overflow: "hidden",
  };

  const imgStyle = {
    width: "100%",
    height: isMobile ? "auto" : "110px",
    objectFit: "cover",
    transition: "transform 0.3s ease",
    display: "block",
  };

  const textStyle = {
    marginTop: "8px",
    fontSize: "14px",
    lineHeight: 1.3,
    fontFamily: "Arial, sans-serif",
    color: "#555555",
  };

  
const mainImgStyle = {
  width: "340px",             // bigger cook image
  height: "340px",
  maxWidth: "none",
  display: "block",
  transition: "opacity 0.6s ease, transform 0.6s ease",
  opacity: isInView ? 1 : 0,
  transform: isInView ? "translate(40px, 0px)" : "translate(40px, 40px)",
  position: "relative",
  zIndex: 10,                 // above red background
};

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "scale(1.08)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <section ref={sectionRef} style={outerStyle}>
      <div style={innerStyle}>
        <div style={leftStyle}>
          <h2 style={titleStyle}>
            <span style={titleSpanStyle}>Indomie</span>
            Recipes
          </h2>

          <div style={gridStyle}>
            {thumbs.map((img, index) => (
              <div key={img.id} style={cardStyle}>
                <div style={imgWrapperStyle}>
                  <img
                    src={`${API_BASE}${img.url}`}
                    alt={img.alternativeText || img.name}
                    style={imgStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
                <p style={textStyle}>
                  {index === 0 &&
                    "Indomie Chicken Frikasse this Valentine – Valentine Recipe"}
                  {index === 1 &&
                    "Six delicious steps to enjoying a plate of Indomie Offal Mix"}
                  {index === 2 &&
                    "Enjoy to make “Indomie Rose Mary Stir-fry” this valentine"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={rightStyle}>
          {!isMobile && kookpic && (
            <img
              src={`${API_BASE}${kookpic.url}`}
              alt={kookpic.alternativeText || kookpic.name}
              style={mainImgStyle}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default RecipesHeroInlineAnimated;

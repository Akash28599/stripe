import React, { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "./NavBar";
import { CONTAINER_MAX_WIDTH, CONTAINER_PADDING, MOBILE_BREAKPOINT } from "../constants";

function HeadSection() {
  const [bgUrl, setBgUrl] = useState("");
  const [images, setImages] = useState({ 
    indomie: "", spoon: "", eatWin: "", chicken: ""
  });
  const [navFixed, setNavFixed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showParticipate, setShowParticipate] = useState(false);
  const [homepageData, setHomepageData] = useState({ heading: "", description: "" });

  // Animation refs and states
  const section3Ref = useRef(null);
  const [section3Visible, setSection3Visible] = useState(false);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const imageRef = useRef(null);

  // Intersection Observer - RESETS every time
  const observerCallback = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setSection3Visible(true);
    } else {
      setSection3Visible(false);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    });

    if (section3Ref.current) {
      observer.observe(section3Ref.current);
    }

    return () => observer.disconnect();
  }, [observerCallback]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchAllData = async () => {
      try {
        // Fetch images
        const imageRes = await fetch("http://localhost:1337/api/upload/files");
        const imageData = await imageRes.json();

        const findByName = (names) =>
          imageData.find(file => names.some(n => file.name.toLowerCase().includes(n)));

        const homeBg2 = findByName(["home-bg2"]);
        const indomie = findByName(["indomie"]);
        const spoon = findByName(["spoon"]);
        const eatWin = findByName(["eat", "win"]);
        const chicken = findByName(["chicken"]);

        if (mounted) {
          if (homeBg2) {
            const bgUrlPath = (homeBg2.formats?.large?.url) || homeBg2.url;
            setBgUrl("http://localhost:1337" + bgUrlPath);
          }

          setImages({
            indomie: indomie ? "http://localhost:1337" + indomie.url : "",
            spoon: spoon ? "http://localhost:1337" + spoon.url : "",
            eatWin: eatWin ? "http://localhost:1337" + eatWin.url : "",
            chicken: chicken ? "http://localhost:1337" + chicken.url : "",
          });
        }

        // Fetch homepage data - FIXED: id 6 = HEADING, id 4 = DESCRIPTION
        const homepageRes = await fetch("http://localhost:1337/api/homepages");
        const homepageJson = await homepageRes.json();
        
        if (mounted && homepageJson.data) {
          const headingItem = homepageJson.data.find(item => item.id === 6);
          const descItem = homepageJson.data.find(item => item.id === 4);
          
          setHomepageData({
            heading: headingItem?.description || "Discover the unique taste of\nIndomie Instant Noodles",
            description: descItem?.description || "Loved by Nigerians"
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAllData();

    const onScroll = () => setNavFixed(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);

    return () => {
      mounted = false;
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const containerStyle = {
    width: "100%",
    minWidth: 0,
    maxWidth: CONTAINER_MAX_WIDTH,
    padding: `0 ${CONTAINER_PADDING}px`,
    margin: "0 auto",
    boxSizing: "border-box",
    position: "relative",
    overflowX: "hidden",
  };

  // Animation styles - HEADING FIRST
  const headingStyle = {
    transform: section3Visible ? "translateX(0)" : "translateX(-100px)",
    opacity: section3Visible ? 1 : 0,
    transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };

  const paragraphStyle = {
    transform: section3Visible ? "translateX(0)" : "translateX(-80px)",
    opacity: section3Visible ? 1 : 0,
    transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s",
  };

  const imageAnimationStyle = {
    transform: section3Visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
    opacity: section3Visible ? 1 : 0,
    transition: "all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s",
  };

  // ✅ NEW: Button animation style
  const buttonAnimationStyle = {
    transform: section3Visible ? "translateY(0)" : "translateY(50px)",
    opacity: section3Visible ? 1 : 0,
    transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s",  // Delayed 0.6s
  };

  const handleSeeProducts = () => {
    console.log("Navigate to /our-range");
  };

  return (
    <>
      {/* Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      />

      <div style={containerStyle}>
        <Navbar fixed={navFixed} />

        {/* Spoon decoration */}
        {images.spoon && !isMobile && (
          <img
            src={images.spoon}
            alt="Spoon Decoration"
            style={{
              position: "absolute",
              top: isMobile ? 90 : 30,
              right: isMobile ? 8 : -10,
              height: isMobile ? 80 : 200,
              objectFit: "contain",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "calc(100vh - 120px)",
            gap: isMobile ? 20 : 36,
            paddingTop: isMobile ? 60 : 30,
            paddingBottom: 40,
            width: "100%",
          }}
        >
          {/* 1st Image: Indomie banner */}
          {images.indomie && (
            <div
              style={{
                width: "100%",
                height: isMobile ? 220 : 340,
                borderTopLeftRadius: isMobile ? 14 : 24,
                borderTopRightRadius: isMobile ? 14 : 24,
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              }}
            >
              <img
                src={images.indomie}
                alt="Indomie Banner"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          )}

          {/* 2nd Image: Eat & Win */}
          {images.eatWin && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => window.location.reload()}
              onMouseEnter={() => setShowParticipate(true)}
              onMouseLeave={() => setShowParticipate(false)}
              style={{
                width: "100%",
                maxWidth: isMobile ? 320 : 380,
                height: isMobile ? 160 : 200,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <img
                src={images.eatWin}
                alt="Eat & Win"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#dc3545",
                  color: "white",
                  padding: isMobile ? "8px 16px" : "12px 24px",
                  borderRadius: "25px",
                  fontSize: isMobile ? "0.85rem" : "1rem",
                  fontWeight: "bold",
                  opacity: showParticipate ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  pointerEvents: "none",
                }}
              >
                CLICK TO PARTICIPATE
              </div>
            </div>
          )}

          {/* 3rd Section - MOBILE vs DESKTOP */}
          <div ref={section3Ref} style={{
            width: "100%",
            padding: isMobile ? "40px 0" : "60px 0",
          }}>
            {isMobile ? (
              /* MOBILE: Heading + Paragraph + Button */
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
                textAlign: "center",
                maxWidth: 400,
                margin: "0 auto",
              }}>
                {/* HEADING */}
                <div ref={headingRef} style={headingStyle}>
                  <div style={{ lineHeight: 1.3 }}>
                    <div style={{ 
                      fontSize: "1.8rem", 
                      fontWeight: 700, 
                      color: "#333",
                      marginBottom: 8 
                    }}>
                      {homepageData.heading.split('\n')[0] || "Discover the unique taste"}
                    </div>
                    <div style={{ 
                      fontSize: "2.2rem", 
                      fontWeight: "bold", 
                      color: "#dc3545",
                      lineHeight: 1.1 
                    }}>
                      {homepageData.heading.split('\n').slice(1).join('\n') || "of Indomie Instant Noodles"}
                    </div>
                  </div>
                </div>

                {/* PARAGRAPH */}
                <div ref={paragraphRef} style={paragraphStyle}>
                  <div style={{ 
                    fontSize: "1rem", 
                    color: "#666", 
                    lineHeight: 1.6 
                  }}>
                    {homepageData.description}
                  </div>
                </div>

                {/* MOBILE BUTTON - ANIMATED + YELLOW HOVER */}
                <button
                  style={{
                    ...buttonAnimationStyle,  // ✅ VIEWPORT ANIMATION
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "14px 32px",
                    borderRadius: 25,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 20px rgba(220,53,69,0.3)",
                  }}
                  onClick={handleSeeProducts}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#ffc107";  // ✅ YELLOW
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 25px rgba(255,193,7,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#dc3545";  // ✅ RED
                    e.target.style.transform = section3Visible ? "translateY(0)" : "translateY(50px)";
                    e.target.style.boxShadow = "0 8px 20px rgba(220,53,69,0.3)";
                  }}
                >
                  SEE ALL PRODUCTS
                </button>
              </div>
            ) : (
              /* DESKTOP: Text LEFT + Chicken RIGHT + BUTTON */
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 48,
                width: "100%",
                height: 500,  // Increased for button space
              }}>
                {/* Left Text + Button */}
                <div style={{
                  flex: 0.6,
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  paddingRight: 32,
                }}>
                  {/* HEADING */}
                  <div ref={headingRef} style={headingStyle}>
                    <div style={{ lineHeight: 1.3 }}>
                      <div style={{ 
                        fontSize: "2.2rem", 
                        fontWeight: 700, 
                        color: "#333",
                        marginBottom: 12 
                      }}>
                        {homepageData.heading.split('\n')[0] || "Discover the unique taste"}
                      </div>
                      <div style={{ 
                        fontSize: "2.8rem", 
                        fontWeight: "bold", 
                        color: "#dc3545",
                        lineHeight: 1.1 
                      }}>
                        {homepageData.heading.split('\n').slice(1).join('\n') || "of Indomie Instant Noodles"}
                      </div>
                    </div>
                  </div>

                  {/* PARAGRAPH */}
                  <div ref={paragraphRef} style={paragraphStyle}>
                    <div style={{ 
                      position: "relative",
                      fontSize: "1.1rem", 
                      color: "#666", 
                      lineHeight: 1.6,
                      maxWidth: 500,
                      left: "90px"
                    }}>
                      {homepageData.description}
                    </div>
                  </div>

                  {/* DESKTOP BUTTON - ANIMATED + YELLOW HOVER */}
                  <button
                    style={{
                      ...buttonAnimationStyle,  // ✅ VIEWPORT ANIMATION
                      backgroundColor: "#dc3545",
                      color: "white",
                      padding: "16px 40px",
                      borderRadius: 25,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 8px 20px rgba(220,53,69,0.3)",
                      alignSelf: "flex-start",
                      marginLeft: "350px",
                    }}
                    onClick={handleSeeProducts}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#ffc107";  // ✅ YELLOW
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 12px 25px rgba(255,193,7,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#dc3545";  // ✅ RED
                      e.target.style.transform = section3Visible ? "translateY(0)" : "translateY(50px)";
                      e.target.style.boxShadow = "0 8px 20px rgba(220,53,69,0.3)";
                    }}
                  >
                    SEE ALL PRODUCTS
                  </button>
                </div>

                {/* Right Chicken Image */}
                {images.chicken && (
                  <div 
                    ref={imageRef} 
                    style={{
                      ...imageAnimationStyle,
                      flex: 0.4,
                      width: "300px",
                      height: "100%",
                      margin: 0,
                      padding: 0,
                      borderRadius: 0,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={images.chicken}
                      alt="Chicken Noodles"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HeadSection;

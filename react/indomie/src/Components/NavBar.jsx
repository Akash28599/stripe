import React, { useState, useEffect, useRef } from "react";
import { CONTAINER_PADDING, MOBILE_BREAKPOINT } from "../constants";

const Navbar = ({ fixed }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/upload/files");
        const data = await res.json();
        
        const logoCandidates = [
          data.find(file => file.name === "logo.png"),
          data.find(file => file.name === "indomie.jpg"),
          data.find(file => file.name.toLowerCase().includes("logo")),
          data.find(file => file.name.toLowerCase().includes("indomie"))
        ].filter(Boolean)[0];
        
        if (logoCandidates) {
          setLogoUrl(`http://localhost:1337${logoCandidates.url}`);
        } else {
          setLogoUrl("");
        }
      } catch (err) {
        console.error("Logo fetch failed:", err);
        setLogoUrl("");
      }
    };
    fetchLogo();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/navbars");
        const data = await res.json();
        setMenuItems(data.data[0]?.menu || []);
      } catch {
        setMenuItems([]);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setShowNavbar(true);
      return;
    }
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // ✅ FIXED: Clean layout - Logo LEFT, Menu RIGHT
  const navStyle = {
    display: showNavbar ? "flex" : "none",
    justifyContent: "space-between",  // Logo left, Menu right
    alignItems: "center",
    backgroundColor: fixed && !isMobile ? "#fff" : "transparent",
    padding: `16px ${CONTAINER_PADDING}px`,
    position: fixed && !isMobile ? "fixed" : "relative",
    top: 0,
    left: 0,
    right: 0,
    maxWidth: `calc(1200px + ${CONTAINER_PADDING * 2}px)`,
    margin: "0 auto ",
    boxSizing: "border-box",
    boxShadow: fixed && !isMobile ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
    zIndex: 1000,
    transition: "all 0.3s ease",
  };

  // ✅ LOGO: Left side with screen padding (from CONTAINER_PADDING)
  const logoContainerStyle = {
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: "1px 0",
};


 const logoStyle = {
  height: 90,         // ⬆ Increase height here
  width: "auto",      
  maxWidth: 290,      // ⬆ You can increase this too
  objectFit: "contain",
};


  // ✅ MENU: Right side with space between
  const menuContainerStyle = {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",            // Pushes menu to RIGHT
    paddingLeft: "15px",           // ✅ SPACE between logo & menu
  };

  const menuUlStyle = {
    display: "flex",
    listStyle: "none",
    gap: 5,
    margin: 0,
    padding: 0,
    alignItems: "center",
  };

  const menuLinkBaseStyle = {
    fontWeight: "bold",
    fontSize: "0.8rem",
    color: "#000",
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: 8,
    whiteSpace: "nowrap",
    transition: "color 0.3s ease",
    cursor: "pointer",
  };

  const handleLogoClick = () => window.location.reload();

  return (
    <>
      <nav style={navStyle}>
        {/* ✅ LOGO LEFT - Screen padding from CONTAINER_PADDING */}
        <div style={logoContainerStyle} onClick={handleLogoClick}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Indomie Logo"
              style={logoStyle}
              onLoad={() => console.log("✅ Logo LOADED from 1337:", logoUrl)}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div
              style={{
                width: 240,
                height: 56,
                backgroundColor: "#000",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              I
            </div>
          )}
        </div>

        {/* ✅ MENU RIGHT - Perfect spacing */}
        <div style={menuContainerStyle}>
          {!isMobile ? (
            <ul style={menuUlStyle}>
              {menuItems.map((item, index) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    style={{
                      ...menuLinkBaseStyle,
                      ...(hoveredIndex === index 
                        ? { color: "orange", backgroundColor: "transparent" } 
                        : {}
                      ),
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              style={{
                background: "none", 
                border: "none", 
                cursor: "pointer",
                width: 32, 
                height: 24, 
                display: "flex", 
                flexDirection: "column",
                justifyContent: "space-between", 
                padding: 0,
              }}
            >
              <span style={{ 
                height: 3, 
                backgroundColor: "#000", 
                borderRadius: 2, 
                transition: "all 0.3s ease", 
                transform: menuOpen ? "rotate(45deg) translate(5px, 6px)" : "none" 
              }} />
              <span style={{ 
                height: 3, 
                backgroundColor: "#000", 
                borderRadius: 2, 
                opacity: menuOpen ? 0 : 1, 
                transition: "all 0.3s ease" 
              }} />
              <span style={{ 
                height: 3, 
                backgroundColor: "#000", 
                borderRadius: 2, 
                transition: "all 0.3s ease", 
                transform: menuOpen ? "rotate(-45deg) translate(7px, -6px)" : "none" 
              }} />
            </button>
          )}
        </div>
      </nav>

      {menuOpen && isMobile && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#28a745", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", gap: 32, zIndex: 2000,
        }} onClick={() => setMenuOpen(false)}>
          {menuItems.map((item) => (
            <a key={item.url} href={item.url} style={{
              color: "white", fontWeight: "bold", fontSize: "1.5rem",
              textDecoration: "none", padding: "16px 32px", borderRadius: 8, 
              whiteSpace: "nowrap",
            }} onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}>
              {item.name}
            </a>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;

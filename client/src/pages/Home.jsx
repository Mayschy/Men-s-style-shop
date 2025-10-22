import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const image1 =
    "https://st29.styapokupayu.ru/images/blog_posts/covers/000/323/615_large.jpg?1691581059";
  const image2 =
    "https://i.pinimg.com/736x/4e/92/9e/4e929e0dab9a3bb49ec11fa5215c723e.jpg";
  const image3 =
    "https://storage.yandexcloud.net/elyts-prod/medialibrary/d79/hmm0446b3da30ccwtjc1x3446tl5b4kn/vJOuol2.jpeg";

  const styles = {
    container: {
      margin: 0,
      padding: 0,
      overflowX: "hidden",
    },
    hero: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    },
    dynamicBackground: {
      position: "absolute",
      top: "-20%",
      left: "-20%",
      right: "-20%",
      bottom: "-20%",

      transform: "skewY(3deg)",
      transformOrigin: "top left",

      backgroundImage: `url(${image1}), url(${image2}), url(${image3})`,
      backgroundAttachment: "fixed",
      backgroundPosition: "top left, center, bottom right",
      backgroundRepeat: "no-repeat, no-repeat, no-repeat",
      backgroundSize: "35% auto, 30% auto, 40% auto",
      filter: "grayscale(100%) blur(2px)",
      opacity: 0.8,
      zIndex: 1,
    },
    heroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 2,
    },
    heroContent: {
      zIndex: 3,
      padding: "20px",
      color: "white",
      textAlign: "center",
      transform: "skewY(-3deg)",
    },
    heroTitle: {
      fontSize: "4.5em",
      margin: "0 0 15px 0",
      fontWeight: 900,
      textTransform: "uppercase",
      letterSpacing: "5px",
      textShadow: "0 5px 10px rgba(0,0,0,0.8)",
    },
    heroSubtitle: {
      fontSize: "1.5em",
      marginBottom: "40px",
      fontWeight: 300,
    },
    shopButton: {
      padding: "15px 40px",
      backgroundColor: "transparent",
      color: "white",
      textDecoration: "none",
      borderRadius: "4px",
      fontWeight: "bold",
      border: "2px solid white",
      transition: "all 0.3s ease",
      ":hover": {
        backgroundColor: "white",
        color: "var(--color-text-dark)",
        border: "2px solid var(--color-text-dark)",
      },
    },
    contentWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      maxWidth: "800px",
      margin: "0 auto",
    },
  };

  return (
    <div className="page-content" style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.dynamicBackground}></div>

        <div style={styles.heroOverlay}></div>

        <div style={styles.heroContent}>
          <div style={styles.contentWrapper}>
            <h1 style={styles.heroTitle}>THE NEW FRONTIER OF MEN'S STYLE</h1>
            <p style={styles.heroSubtitle}>
              Discover curated collections for the modern man. Elegance meets
              simplicity.
            </p>
            <Link
              to="/shop"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "var(--color-text-dark)";
                e.currentTarget.style.border =
                  "2px solid var(--color-text-dark)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.border = "2px solid white";
              }}
              style={styles.shopButton}
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

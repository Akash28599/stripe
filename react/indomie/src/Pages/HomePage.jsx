import React from "react";
import HeadSection from "../Components/HeadSection";
import ProductSection from "../Components/Chicken";
import RecipesHeroInlineAnimated from "../Components/ReceipeHero";

function HomePage() {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <HeadSection />
      <ProductSection/>
      <RecipesHeroInlineAnimated/>
      {/* Other content */}
    </div>
  );
}

export default HomePage;

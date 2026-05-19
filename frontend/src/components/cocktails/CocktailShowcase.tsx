'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Parallax, Mousewheel, Scrollbar, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { COCKTAILS } from '@/data/cocktails';
import type { Cocktail } from '@/types/cocktail';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/scrollbar';
import './cocktail-showcase.css';

// Select 10 varied cocktails to feature in the showcase
const FEATURED_COCKTAILS = [
  COCKTAILS[0],  // Pisco Sour
  COCKTAILS[3],  // Old Fashioned
  COCKTAILS[1],  // Mojito
  COCKTAILS[5],  // Aperol Spritz
  COCKTAILS[2],  // Margarita
  COCKTAILS[4],  // Negroni
  COCKTAILS[8],  // Cosmopolitan
  COCKTAILS[9],  // Moscow Mule
  COCKTAILS[17], // Sangría
  COCKTAILS[19], // Terremoto
];

function getDifficultyClass(d: string): string {
  if (d === 'fácil') return 'easy';
  if (d === 'medio') return 'medium';
  return 'hard';
}

function getDifficultyLabel(d: string): string {
  if (d === 'fácil') return '🟢 Fácil';
  if (d === 'medio') return '🟡 Medio';
  return '🔴 Difícil';
}

export default function CocktailShowcase() {
  return (
    <section className="cocktailShowcase">
      <div className="sectionWrapper">
        <Swiper
          modules={[EffectCoverflow, Parallax, Mousewheel, Scrollbar, Autoplay]}
          direction="horizontal"
          loop={false}
          speed={1500}
          slidesPerView={4}
          spaceBetween={60}
          mousewheel
          parallax
          centeredSlides
          effect="coverflow"
          coverflowEffect={{
            rotate: 35,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 3000,
            pauseOnMouseEnter: true,
          }}
          scrollbar={{
            el: '.cocktail-scrollbar',
            draggable: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 30 },
            600: { slidesPerView: 2, spaceBetween: 40 },
            1000: { slidesPerView: 3, spaceBetween: 50 },
            1400: { slidesPerView: 4, spaceBetween: 60 },
            2300: { slidesPerView: 5, spaceBetween: 60 },
          }}
          className="swiper"
        >
          {/* Parallax background */}
          <div
            className="parallax-bg"
            data-swiper-parallax="600"
            data-swiper-parallax-scale="0.85"
          />

          {FEATURED_COCKTAILS.map((cocktail: Cocktail) => (
            <SwiperSlide key={cocktail.id}>
              <div
                className="cardPopout"
                data-swiper-parallax="30"
                data-swiper-parallax-scale="0.9"
                data-swiper-parallax-opacity="0.8"
                data-swiper-parallax-duration="1000"
              >
                {/* Cocktail image */}
                <Image
                  src={cocktail.image}
                  alt={cocktail.name}
                  width={800}
                  height={400}
                  data-swiper-parallax="80"
                  data-swiper-parallax-duration="2000"
                  style={{ width: '100%', height: 'auto', aspectRatio: '2/1', objectFit: 'cover', marginBottom: '20px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}
                />

                {/* Title with spirit-specific font */}
                <h2
                  className="cocktailTitle"
                  data-spirit={cocktail.baseSpirit}
                  data-swiper-parallax="80"
                  data-swiper-parallax-duration="1000"
                >
                  {cocktail.name}
                </h2>

                {/* Subtitle: difficulty + prep time */}
                <h4
                  className="cocktailSubtitle"
                  data-swiper-parallax="80"
                  data-swiper-parallax-duration="1500"
                >
                  <span className={`diffBadge ${getDifficultyClass(cocktail.difficulty)}`}>
                    {getDifficultyLabel(cocktail.difficulty)}
                  </span>
                  <span style={{ color: '#777' }}>•</span>
                  <span>⏱ {cocktail.prepTime} min</span>
                  <span style={{ color: '#777' }}>•</span>
                  <span>{cocktail.glassType}</span>
                </h4>

                {/* Description */}
                <div
                  className="cocktailDesc"
                  data-swiper-parallax="80"
                  data-swiper-parallax-duration="1250"
                >
                  <p>{cocktail.description}</p>
                </div>

                {/* Tags */}
                <div className="tagRow">
                  {cocktail.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                  <span style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                    {cocktail.baseSpirit}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href={`/cocteles/${cocktail.slug}`}
                  className="ctaBtn"
                  data-swiper-parallax="80"
                  data-swiper-parallax-opacity="0.2"
                  data-swiper-parallax-duration="1750"
                >
                  Ver Receta Completa
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
                  </svg>
                </Link>
              </div>
            </SwiperSlide>
          ))}

          <div className="swiper-scrollbar cocktail-scrollbar" />
        </Swiper>
      </div>
    </section>
  );
}

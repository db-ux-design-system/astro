import React, { type ReactElement, useState } from 'react';
import { DBButton } from '@db-ux/react-core-components';

/**
 * @interface Carousel
 * @description Interface representing an individual carousel item with an image and optional caption.
 * @property {string} src - The source URL of the image.
 * @property {string} [caption] - An optional caption for the carousel image.
 */
interface Carousel {
  src: string;
  caption?: string;
}

/**
 * @interface CarouselProps
 * @description Interface for the props of the Carousel component.
 * @property {readonly Carousel[]} [items] - The list of carousel items to display. Optional, default is an empty array.
 */
interface CarouselProps {
  readonly items?: readonly Carousel[];
}

/**
 * A functional component that renders a carousel of images with optional captions.
 *
 * @param {CarouselProps} props - The component's props.
 * @param {readonly Carousel[]} props.items - The list of carousel items to display.
 *
 * @returns {ReactElement | null} The rendered carousel component or null if no items are provided.
 *
 * @example
 * // Example usage of the Carousel component with items and optional captions.
 * ```tsx
 * const carouselItems = [
 *   { src: "image1.jpg", caption: "Image 1" },
 *   { src: "image2.jpg" },
 * ];
 * <Carousel items={carouselItems} />
 * ```
 */
// TODO: Use BuiltinIntl
export function Carousel({ items = [] }: CarouselProps): ReactElement | null {
  const [active, setActive] = useState<number>(0);
  const max = items.length;

  if (max === 0) return null;

  const nextSlide = () => setActive((prev) => (prev + 1) % max);
  const prevSlide = () => setActive((prev) => (prev - 1 + max) % max);

  const isActive = (value: number) => (active === value ? 'active' : '');

  const setSliderStyle = () => {
    const transition = active * -(100 / max);
    return {
      width: max * 100 + '%',
      transform: `translateX(${transition}%)`,
      transition: 'transform 0.3s ease-in-out',
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  return (
    <section
      aria-label="Image Carousel"
      aria-live="polite"
      aria-roledescription="carousel"
      className="dba-carousel"
    >
      <div className="dba-carousel-viewport-wrapper">
        <ol style={setSliderStyle()}>
          {items.map((item, index) => (
            <li key={index} style={{ flex: `0 0 ${100 / max}%` }}>
              <figure>
                <img
                  src={item.src}
                  alt={
                    item.caption ? item.caption : `Slide ${index + 1} of ${max}`
                  }
                ></img>
                {item.caption && <figcaption>{item.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ol>
      </div>
      <aside className="dba-carousel-navigation-list">
        <DBButton
          aria-label="Previous slide"
          icon="chevron_left"
          onClick={prevSlide}
          onKeyDown={handleKeyDown}
        ></DBButton>
        <div>
          {items.map((_, index) => (
            <DBButton
              aria-label={`Slide ${index + 1}`}
              key={index}
              onClick={() => setActive(index)}
              data-active={isActive(index) ? true : undefined}
              className="dba-carousel-navigation-list-button"
            />
          ))}
        </div>
        <DBButton
          aria-label="Next slide"
          icon="chevron_right"
          onClick={nextSlide}
          onKeyDown={handleKeyDown}
        ></DBButton>
      </aside>
    </section>
  );
}

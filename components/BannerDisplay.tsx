import React from 'react';
import { motion } from 'framer-motion';
import type { Banner } from '../types';

const bannerAnimations = {
    'none': { initial: { opacity: 1 }, animate: { opacity: 1 } },
    'fade-in': { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, ease: 'easeInOut' } },
    'slide-in-top': { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 }, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    'pulse': { animate: { scale: [1, 1.01, 1] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } }
};

const ResponsiveStyles: React.FC<{ banner: Banner }> = ({ banner }) => {
    const styles = `
        #banner-${banner.id} {
            height: ${banner.height_mobile || 'auto'};
        }
        @media (min-width: 768px) {
            #banner-${banner.id} {
                height: ${banner.height_tablet || 'auto'};
            }
        }
        @media (min-width: 1024px) {
            #banner-${banner.id} {
                height: ${banner.height_desktop || 'auto'};
            }
        }
    `;
    return <style>{styles}</style>;
};

export const getBannerForPage = (pageName: string, banners: Banner[]): Banner | null => {
    if (!banners || banners.length === 0) return null;

    // 1. Find a page-specific banner first.
    const specificBanner = banners.find(b => b.is_active && b.display_pages.includes(pageName));
    if (specificBanner) return specificBanner;

    // 2. If no specific banner, find the default banner.
    const defaultBanner = banners.find(b => b.is_active && b.is_default);
    if (!defaultBanner) return null;

    // 3. Check if the page is excluded from the default banner.
    if (defaultBanner.excluded_pages.includes(pageName)) {
        return null;
    }

    // 4. Return the default banner.
    return defaultBanner;
};

interface BannerDisplayProps {
    banner: Banner | null;
}

const BannerDisplay: React.FC<BannerDisplayProps> = ({ banner }) => {
    if (!banner) return null;

    const selectedAnimation = bannerAnimations[banner.animation_type] || bannerAnimations['fade-in'];
    const bannerId = `banner-${banner.id}`;
    
    const BannerContent = (
        <motion.div
            id={bannerId}
            key={banner.id}
            className="w-full block bg-cover bg-center bg-no-repeat"
            style={{
                borderRadius: banner.border_radius || '0px',
                opacity: banner.opacity,
                backgroundImage: `url(${banner.image_url})`,
            }}
            {...selectedAnimation}
        />
    );

    return (
        <div className="mb-8 px-8 -mx-8">
            <ResponsiveStyles banner={banner} />
            {banner.redirect_url ? (
                <a href={banner.redirect_url} target={banner.redirect_url.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                    {BannerContent}
                </a>
            ) : (
                BannerContent
            )}
        </div>
    );
};

export default BannerDisplay;
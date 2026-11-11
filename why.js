/* Why Choose Us tab */
pager($("#feat"), () => { const w = innerWidth, h = innerHeight; if (w >= 1000) return 4; if (w >= 560 && h >= 720) return {n:4, cols:2}; if (w >= 560) return 2; return 1; });

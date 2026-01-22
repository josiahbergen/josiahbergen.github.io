document.addEventListener('DOMContentLoaded', async () => {
    console.log('CAF Menu Loader: Starting...');
    
    try {
        // Load menu data
        const menuData = await fetch('/caf/menu.json').then(res => res.json());
    console.log('Menu data loaded:', { weeks: menuData.weeks.length });
    
    // Get current date
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const isPast2PM = currentTime >= 1400; // 2:00 PM = 1400
    
    console.log('Current date info:', {
        fullDate: now.toISOString(),
        dateOnly: currentDate.toISOString().split('T')[0],
        time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        isPast2PM
    });
    
    // Find which week contains today's date
    let selectedWeek = null;
    let selectedDateRange = null;
    
    console.log('Searching for matching week/date range...');
    for (const week of menuData.weeks) {
        for (const dateRange of week.dates) {
            const [startStr, endStr] = dateRange.split('/');
            const startDate = new Date(startStr);
            const endDate = new Date(endStr);
            
            if (currentDate >= startDate && currentDate <= endDate) {
                selectedWeek = week;
                selectedDateRange = dateRange;
                console.log(`Found matching week: Week ${week.week}, range: ${dateRange}`);
                break;
            }
        }
        if (selectedWeek) break;
    }
    
    // If no week found, use first week as fallback
    if (!selectedWeek) {
        selectedWeek = menuData.weeks[0];
        console.warn('No matching week found, using first week as fallback');
    }
    
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayIndex = currentDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayIndex];
    
    console.log('Day info:', {
        dayIndex,
        dayName,
        availableDays: Object.keys(selectedWeek.lunch || {})
    });
    
    // Format date for display
    const dateOptions = {year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);
    
    // Update date display
    const dateElement = document.querySelector('.date');
    if (dateElement) {
        dateElement.textContent = `(${formattedDate})`;
    }
    
    // Get menu data for today
    const lunchMenu = selectedWeek.lunch?.[dayName];
    const dinnerMenu = selectedWeek.dinner?.[dayName];
    
    
    // Populate lunch menu
    if (lunchMenu) {
        populateMenu('lunch', lunchMenu);
    } else {
        console.warn('No lunch menu found for', dayName);
    }
    
    // Populate dinner menu
    if (dinnerMenu) {
        console.log('Populating dinner menu...');
        populateMenu('dinner', dinnerMenu);
    }
    
    // Set initial view based on time
    const lunchSection = document.getElementById('lunch');
    const dinnerSection = document.getElementById('dinner');
    const lunchBtn = document.querySelector('[data-meal="lunch"]');
    const dinnerBtn = document.querySelector('[data-meal="dinner"]');
    
    const initialView = isPast2PM ? 'dinner' : 'lunch';
    console.log(`Setting initial view to: ${initialView} (isPast2PM: ${isPast2PM})`);
    
    if (isPast2PM && dinnerSection) {
        lunchSection?.classList.add('hidden');
        dinnerSection.classList.remove('hidden');
        lunchBtn?.classList.remove('active');
        dinnerBtn?.classList.add('active');
    } else if (lunchSection) {
        lunchSection.classList.remove('hidden');
        dinnerSection?.classList.add('hidden');
        lunchBtn?.classList.add('active');
        dinnerBtn?.classList.remove('active');
    }
    
    console.log('CAF Menu Loader: Complete!');
    
    } catch (error) {
        console.error('Error loading menu:', error);
    }
    
    // Toggle functionality
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const mealSections = document.querySelectorAll('.meal-section');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetMeal = btn.dataset.meal;
            
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            mealSections.forEach(section => {
                if (section.id === targetMeal) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });
});

function populateMenu(mealType, menuData) {
    const section = document.getElementById(mealType);
    if (!section) {
        console.error(`Section not found for ${mealType}`);
        return;
    }
    
    // Chef's Feature
    const chefBox = section.querySelector('.station-chef');
    if (chefBox && menuData.chefsFeature) {
        const itemEl = chefBox.querySelector('.item');
        const sidesEl = chefBox.querySelector('.sides');
        if (itemEl) itemEl.textContent = menuData.chefsFeature;
        if (sidesEl && menuData.chefsFeatureSides) {
            sidesEl.textContent = menuData.chefsFeatureSides;
        } else if (sidesEl) {
            sidesEl.textContent = '';
        }
    }
    
    // Global
    const globalBox = section.querySelector('.station-global');
    if (globalBox && menuData.global) {
        const itemEl = globalBox.querySelector('.item');
        const sidesEl = globalBox.querySelector('.sides');
        if (itemEl) itemEl.textContent = menuData.global;
        if (sidesEl && menuData.globalSides) {
            sidesEl.textContent = menuData.globalSides;
        } else if (sidesEl) {
            sidesEl.textContent = '';
        }
    }
    
    // South Asian
    const southAsianBox = section.querySelector('.station-south-asian');
    if (southAsianBox && menuData.southAsian) {
        const itemEl = southAsianBox.querySelector('.item');
        const sidesEl = southAsianBox.querySelector('.sides');
        if (itemEl) itemEl.textContent = menuData.southAsian;
        if (sidesEl && menuData.southAsianSides) {
            sidesEl.textContent = menuData.southAsianSides;
        } else if (sidesEl) {
            sidesEl.textContent = '';
        }
    }
    
    // Asian
    const asianBox = section.querySelector('.station-asian');
    if (asianBox && menuData.asian) {
        const itemEl = asianBox.querySelector('.item');
        const sidesEl = asianBox.querySelector('.sides');
        if (itemEl) itemEl.textContent = menuData.asian;
        if (sidesEl && menuData.asianSides) {
            sidesEl.textContent = menuData.asianSides;
        } else if (sidesEl) {
            sidesEl.textContent = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initCustomSelects();
    initFormValidation();
    initMobileMenu();
    initMobilePopup();
});


function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}


function initCustomSelects() {
    const selects = document.querySelectorAll('.primary-form select');
    
    selects.forEach(select => {
        if (select.closest('.custom-select')) return;

        const wrapper = document.createElement('div');
        wrapper.className = `custom-select ${select.className}`;
        
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-options';

        const selectedOption = select.options[select.selectedIndex] || select.options[0];
        trigger.innerHTML = `<span>${selectedOption.text}</span>`;
        
        Array.from(select.options).forEach(option => {
            if (option.disabled) return;
            
            const optionDiv = document.createElement('div');
            optionDiv.className = 'custom-option';
            optionDiv.dataset.value = option.value;
            optionDiv.innerHTML = `
                <span>${option.text}</span>
                <img src="./assets/images/select-option-checkmark.svg" class="check" ${option.selected ? 'style="display:block;"' : 'style="display:none;"'}>
            `;
            
            optionDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                
                select.value = option.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                
                trigger.querySelector('span').textContent = option.text;
                optionsContainer.querySelectorAll('.check').forEach(img => img.style.display = 'none');
                optionDiv.querySelector('.check').style.display = 'block';
                
                wrapper.classList.remove('open');
            });
            
            optionsContainer.appendChild(optionDiv);
        });


        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-select').forEach(el => {
                if (el !== wrapper) el.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        });

        select.style.display = 'none';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(trigger);
        wrapper.appendChild(optionsContainer);
        wrapper.appendChild(select);
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select').forEach(el => el.classList.remove('open'));
    });
}


function initFormValidation() {
    const form = document.querySelector('.primary-form');
    const queryTypeSelect = document.getElementById('query-type');
    const projectsSelect = document.getElementById('projects');
    const projectsContainer = document.getElementById('projects-container');
    const globalError = document.getElementById('form-error');

    if (!form) return;

    queryTypeSelect?.addEventListener('change', (e) => {
        const isProjects = e.target.value === 'Projects';
        projectsContainer.style.display = isProjects ? 'block' : 'none';
        
        if (!isProjects) {
            projectsSelect.selectedIndex = 0;
            updateCustomSelectUI(projectsSelect);
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        globalError.style.display = 'none';
        document.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        
        const data = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            mobile: document.getElementById('mobile'),
            query: queryTypeSelect,
            projects: projectsSelect
        };

        let hasError = false;

        if (data.name.value.trim().length < 2) {
            showFieldError(data.name, "Name is required.");
            hasError = true;
        }

        if (!data.email.value.trim()) {
            showFieldError(data.email, "Email is required.");
            hasError = true;
        }

        const mobileRegex = /^(\+\d{2})?0?\d{10}$/;
        if (!mobileRegex.test(data.mobile.value.trim())) {
            showFieldError(data.mobile, "Please enter a valid 10-digit mobile number.");
            hasError = true;
        }

        if (!data.query.value) {
            showSelectError(data.query, "Please select a query type.");
            hasError = true;
        }

        if (data.query.value === 'Projects' && !data.projects.value) {
            showSelectError(data.projects, "Please select a project.");
            hasError = true;
        }

        if (hasError) return;

        globalError.style.color = "green";
        globalError.textContent = "Form submitted successfully!";
        globalError.style.display = 'block';
        
        form.reset();
        resetAllCustomSelects();
        projectsContainer.style.display = 'none';
    });

    function showFieldError(input, msg) {
        input.classList.add('input-error');
        const errorEl = document.getElementById(`${input.id}-error`);
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.style.display = 'block';
        }
    }

    function showSelectError(select, msg) {
        const wrapper = select.closest('.custom-select');
        wrapper?.querySelector('.custom-select-trigger').classList.add('input-error');
        const errorEl = document.getElementById(`${select.id}-error`);
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.style.display = 'block';
        }
    }

    function resetAllCustomSelects() {
        document.querySelectorAll('.custom-select').forEach(wrapper => {
            const select = wrapper.querySelector('select');
            if (select) updateCustomSelectUI(select);
        });
    }

    function updateCustomSelectUI(select) {
        const wrapper = select.closest('.custom-select');
        if (!wrapper) return;
        
        const defaultOpt = select.options[0];
        wrapper.querySelector('.custom-select-trigger span').textContent = defaultOpt.text;
        wrapper.querySelectorAll('.check').forEach(img => img.style.display = 'none');
    }
}


function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.getElementById('close-side-menu');

    if (!menuBtn || !sideMenu) return;

    menuBtn.addEventListener('click', () => {
        sideMenu.classList.add('active');
        document.body.classList.add('no-scroll');
    });
    closeBtn?.addEventListener('click', () => {
        sideMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
    
    sideMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            sideMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}


function initMobilePopup() {
    const trigger = document.querySelector('.contact-us-btn');
    const popup = document.getElementById('form-popup');
    const closeBtn = document.getElementById('close-popup');

    if (!trigger || !popup) return;

    trigger.addEventListener('click', () => {
        popup.classList.add('active');
        document.body.classList.add('no-scroll');
    });
    closeBtn?.addEventListener('click', () => {
        popup.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
}

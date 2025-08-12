document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('nav ul li a');
  const inquiryForm = document.getElementById('inquiryForm');
  const formStatus = document.getElementById('formStatus');
  const dynamicContentLink = document.getElementById('dynamicContentLink');
  const dynamicContentArea = document.getElementById('dynamic-content-area');

  // Navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      if (link.getAttribute('href').startsWith('#')) {
        event.preventDefault();
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - (header?.offsetHeight || 0),
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Form Submission
  inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(inquiryForm);
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      formStatus.textContent = 'Please enter a valid email address.';
      formStatus.classList.add('error');
      formStatus.style.display = 'block';
      return;
    }

    formStatus.textContent = 'Submitting...';
    formStatus.classList.remove('success', 'error');
    formStatus.classList.add('loading');
    formStatus.style.display = 'block';

    setTimeout(() => {
      formStatus.textContent = 'Inquiry sent successfully! We will get back to you soon.';
      formStatus.classList.add('success');
      formStatus.classList.remove('loading');
      inquiryForm.reset();
      localStorage.setItem('lastInquiryName', data.name);
      localStorage.setItem('lastInquiryEmail', data.email);
      formStatus.style.display = 'block';
    }, 1000);
  });

  // Dynamic Content (News)
  dynamicContentLink.addEventListener('click', (event) => {
    event.preventDefault();
    navLinks.forEach(nav => nav.classList.remove('active'));
    dynamicContentLink.classList.add('active');
    dynamicContentArea.innerHTML = '<h3>Loading Latest News...</h3><p>Please wait...</p>';
    fetch('data/news.html')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then(htmlContent => {
        dynamicContentArea.innerHTML = `
          <h3>Latest News & Updates</h3>
          <div class="news-feed">
            ${htmlContent}
            <p style="font-style: italic; margin-top: 20px;">Content loaded dynamically via JavaScript!</p>
          </div>
        `;
        // Add event listeners for "Read More" links
        document.querySelectorAll('.news-item a[href^="#news-details"]').forEach(link => {
          link.addEventListener('click', (event) => {
            event.preventDefault();
            const newsId = link.getAttribute('href').substring(1);
            dynamicContentArea.innerHTML = `
              <h3>News Details</h3>
              <p>Full details for news item ${newsId} would be loaded here.</p>
              <button class="btn" onclick="window.location.href='#dynamic-content-area'">Back to News</button>
            `;
            window.scrollTo({
              top: dynamicContentArea.offsetTop - (header?.offsetHeight || 0),
              behavior: 'smooth'
            });
          });
        });
      })
      .catch(error => {
        dynamicContentArea.innerHTML = `
          <h3>Failed to Load News</h3>
          <p>Could not retrieve the latest updates. Please try again later.</p>
          <p style="color: red;">Error: ${error.message}</p>
        `;
      });
  });

  // Model Details
  document.querySelectorAll('.model-card button[data-action="view-details"]').forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const modelName = button.dataset.model;
      dynamicContentArea.innerHTML = `
        <h3>${modelName} Details</h3>
        <p>Explore the features of the Velocity ${modelName}. Contact us for more information!</p>
        <button class="btn" onclick="window.location.href='#contact'">Get a Quote</button>
      `;
      window.scrollTo({
        top: dynamicContentArea.offsetTop - (header?.offsetHeight || 0),
        behavior: 'smooth'
      });
    });
  });

  // LocalStorage
  const savedName = localStorage.getItem('lastInquiryName');
  if (savedName) {
    document.getElementById('name').value = savedName;
  }

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});

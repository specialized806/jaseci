class FeedbackWidget {
    constructor() {
        this.container = document.getElementById('feedbackContainer');
        this.toggle = document.getElementById('feedbackToggle');
        this.form = document.getElementById('feedbackForm');
        this.formElement = document.getElementById('feedbackFormElement');
        this.ratingBtns = document.querySelectorAll('.rating-btn');
        this.submitBtn = document.getElementById('submitBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.successMessage = document.getElementById('successMessage');
        this.commentInput = document.getElementById('commentInput');

        this.selectedRating = null;
        this.isSubmitting = false;

        this.init();
    }

    init() {
        // Check if we should hide the form on main domain
        this.checkDomain();

        // Set up event listeners
        this.toggle.addEventListener('click', () => this.toggleForm());
        this.cancelBtn.addEventListener('click', () => this.closeForm());

        this.ratingBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectRating(btn));
        });

        // Add input listener for comment field
        this.commentInput.addEventListener('input', () => this.updateSubmitButton());

        this.formElement.addEventListener('submit', (e) => this.handleSubmit(e));

        // Close form when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.closeForm();
            }
        });

        // Populate hidden fields
        this.populateHiddenFields();
    }

    checkDomain() {
        const currentUrl = window.location.href;
        const mainDomainUrl = 'https://www.jac-lang.org/';

        // Only hide if we're exactly on the main domain (no path)
        if (currentUrl === mainDomainUrl) {
            this.container.style.display = 'none';
            return;
        }
    }

    toggleForm() {
        this.form.classList.toggle('active');
        if (this.form.classList.contains('active')) {
            this.populateHiddenFields();
        }
    }

    closeForm() {
        this.form.classList.remove('active');
        this.resetForm();
    }

    selectRating(btn) {
        // Remove selected class from all buttons
        this.ratingBtns.forEach(b => b.classList.remove('selected'));

        // Add selected class to clicked button
        btn.classList.add('selected');

        // Store rating
        this.selectedRating = btn.dataset.rating;
        document.getElementById('ratingInput').value = this.selectedRating;

        // Update submit button immediately after rating selection
        this.updateSubmitButton();
    }

    updateSubmitButton() {
        const comment = this.commentInput.value.trim();
        const hasRating = this.selectedRating !== null;
        const hasComment = comment.length > 0;

        console.log('Update Submit Button:', { hasRating, hasComment, comment: comment.length, rating: this.selectedRating });

        this.submitBtn.disabled = !(hasRating && hasComment);
    }

    populateHiddenFields() {
        document.getElementById('urlInput').value = window.location.href;
        document.getElementById('timestampInput').value = new Date().toISOString();
        document.getElementById('userAgentInput').value = navigator.userAgent;
        document.getElementById('pageTitleInput').value = document.title;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        this.isSubmitting = true;
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Submitting...';

        try {
            const formData = new FormData(this.formElement);

            const response = await fetch(this.formElement.action, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            // Show success message
            this.showSuccess();

        } catch (error) {
            console.error('Error submitting feedback:', error);
            // Still show success since no-cors mode doesn't give us response details
            this.showSuccess();
        }
    }

    showSuccess() {
        this.successMessage.classList.add('show');
        setTimeout(() => {
            this.successMessage.classList.remove('show');
            this.closeForm();
        }, 2000);
    }

    resetForm() {
        this.formElement.reset();
        this.ratingBtns.forEach(btn => btn.classList.remove('selected'));
        this.selectedRating = null;
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Submit';
        this.isSubmitting = false;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.feedbackWidget = new FeedbackWidget();
});
=======
document.addEventListener("DOMContentLoaded", function () {
  // Don't show on playground
  if (window.location.pathname.startsWith("/playground")) return;

  const main = document.querySelector(".md-content__inner");
  if (!main) return;

  let feedbackVisible = false; // to ensure it only shows once

  function showFeedbackPopup() {
    if (feedbackVisible) return; // Don't create twice
    feedbackVisible = true;

    // Create feedback popup
    const feedback = document.createElement("div");
    feedback.className = "feedback-popup";
    feedback.innerHTML = `
      <div class="feedback-container">
        <button id="feedback-close" class="feedback-close" title="Close">×</button>
        <div class="feedback-title">How do you like the documentation?</div>
        <div class="feedback-buttons">
          <button class="thumb" data-type="up" title="Thumbs up">👍</button>
          <button class="thumb" data-type="down" title="Thumbs down">👎</button>
        </div>
        <textarea id="feedback-comment" class="feedback-textarea" rows="2" placeholder="Any comments? (optional)"></textarea>
        <button id="feedback-send" class="feedback-send">Send</button>
        <span id="feedback-status" class="feedback-status"></span>
      </div>
    `;
    document.body.appendChild(feedback);

    const status = feedback.querySelector("#feedback-status");
    const sendBtn = feedback.querySelector("#feedback-send");
    const closeBtn = feedback.querySelector("#feedback-close");
    const thumbs = feedback.querySelectorAll('.thumb');
    let rating = null;

    function updateThumbs() {
      thumbs.forEach(btn => btn.classList.toggle('selected', rating === btn.getAttribute('data-type')));
      sendBtn.disabled = !rating;
      sendBtn.classList.toggle('active', !!rating);
      sendBtn.textContent = rating ? 'Send' : 'Select rating';
    }
    updateThumbs();

    thumbs.forEach(btn => {
      btn.onclick = function () {
        rating = btn.getAttribute('data-type');
        updateThumbs();
      };
    });

    sendBtn.onclick = function () {
      if (!rating) return;
      sendFeedback();
    };

    closeBtn.onclick = function () {
      feedback.remove();
    };

    function sendFeedback() {
      const comment = feedback.querySelector("#feedback-comment").value;
      const page = document.title || window.location.pathname;
      status.textContent = "Sending...";
      sendBtn.disabled = true;
      fetch("https://script.google.com/macros/s/AKfycbwnF5MK6hrie4f4V0beTtRYueGrjBIBfBvlsiGnMEeeoMhJpJS8H5hDU8BzU5c9AhJ3/exec", {
        method: "POST",
        body: JSON.stringify({ page, rating, comment }),
        headers: { "Content-Type": "application/json" }
      })
        .then(() => {
          status.textContent = "Thank you for your feedback!";
          sendBtn.disabled = true;
          setTimeout(() => { feedback.remove(); }, 2500);
        })
        .catch(() => {
          status.textContent = "Error sending feedback.";
          sendBtn.disabled = false;
        });
    }
  }

  // Detect when user scrolls to 95% of the     page
  window.addEventListener('scroll', function () {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const scrolledPercent = (scrollTop + windowHeight) / docHeight * 100;

  if (scrolledPercent >= 95) {
    showFeedbackPopup();
  }
});
});

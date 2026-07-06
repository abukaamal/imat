import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // ============================================================
    // PORTFOLIO APP - MODULAR JAVASCRIPT (TANPA API KEY)
    // ============================================================
    const CONFIG = {
      API_URL: 'https://script.google.com/macros/s/AKfycbzyZzYkTMRuvw8F6MtFHqm6dBUeFyOMO7i5GTs6jRrrynm7VszHUcAJcwTYdAV4o6DqVw/exec',
      FIELD_KEYS: ['nama', 'email', 'telpon', 'alamat', 'pesan'],
      REGEX: {
        nama: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        alamat: /^.{3,100}$/,
        pesan: /^.{5,500}$/
      }
    };

    // ============================================================
    // DATA STORE
    // ============================================================
    const DataStore = {
      _allData: null as any,
      _messages: null as any,
      setAllData(data: any) {
        this._allData = data;
      },
      getAllData() {
        return this._allData;
      },
      setMessages(messages: any) {
        this._messages = messages;
      },
      getMessages() {
        return this._messages;
      },
      getSocialLinks() {
        if (this._allData && this._allData.footer) {
          const footer = this._allData.footer;
          const links = [];
          const socialKeys = ['github', 'linkedin', 'twitter', 'instagram', 'facebook', 'youtube'];
          for (let i = 0; i < socialKeys.length; i++) {
            const key = socialKeys[i];
            if (footer[key] && footer[key].trim() !== '') {
              links.push({
                key: key,
                url: footer[key]
              });
            }
          }
          return links;
        }
        return [];
      }
    };

    // ============================================================
    // API MODULE
    // ============================================================
    const ApiModule = {
      fetchAllData() {
        return fetch(CONFIG.API_URL + '?action=all')
          .then((response) => {
            if (!response.ok) throw new Error('Network error: ' + response.status);
            return response.json();
          })
          .catch(() => {
            return null;
          });
      },
      sendMessage(payload: any) {
        const formData = new FormData();
        formData.append('nama', payload.nama);
        formData.append('email', payload.email);
        formData.append('telpon', payload.telpon);
        formData.append('alamat', payload.alamat);
        formData.append('pesan', payload.pesan);
        return fetch(CONFIG.API_URL, {
          method: 'POST',
          body: formData
        })
          .then((response) => {
            if (!response.ok) throw new Error('Network error: ' + response.status);
            return response.json();
          });
      }
    };

    // ============================================================
    // RENDERER MODULE
    // ============================================================
    const Renderer = {
      _sanitize(str: any) {
        if (!str) return '';
        return String(str).replace(/<[^>]*>/g, '');
      },
      showError(containerId: string, message: string) {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = '<div class="loading-indicator">' + this._sanitize(message) + '</div>';
        }
      },
      renderLogo(data: any) {
        const logoContainer = document.getElementById('logoContainer');
        if (!logoContainer) return;
        if (data && data.image_url && data.image_url.trim() !== '') {
          const logoName = this._sanitize(data.logo_name || 'devfolio');
          const imageUrl = this._sanitize(data.image_url);
          logoContainer.innerHTML = `
            <img src="${imageUrl}" alt="Logo" class="logo-img" />
            <span class="logo-text">${logoName}</span>
          `;
        } else {
          const logoName = data && data.logo_name ? this._sanitize(data.logo_name) : '⚡ dev<span style="-webkit-text-fill-color:#1e293b;">folio</span>';
          logoContainer.innerHTML = `
            <span class="logo-text">${logoName}</span>
          `;
        }
      },
      renderBeranda(data: any) {
        const container = document.getElementById('berandaContent');
        if (!container) return;
        if (!data || Object.keys(data).length === 0) {
          this.showError('berandaContent', 'Gagal memuat data Beranda');
          return;
        }
        const title = this._sanitize(data.title || '');
        const subtitle = this._sanitize(data.subtitle || '');
        const experience = this._sanitize(data.experience || '');
        const imageUrl = this._sanitize(data.image_url || '');
        container.innerHTML =
          '<div class="hero">' +
          '<div class="hero-text">' +
          '<h1>' + title + '</h1>' +
          '<p>' + subtitle + '</p>' +
          '<p style="margin-top:18px; font-size:1rem; color:#475569;">' +
          '<i class="fas fa-code" style="color:#2563eb;"></i> ' + experience +
          '</p>' +
          '</div>' +
          '<div class="hero-image">' +
          '<img src="' + imageUrl + '" alt="foto profile" />' +
          '</div>' +
          '</div>';
      },
      renderTentang(data: any) {
        const container = document.getElementById('tentangContent');
        if (!container) return;
        if (!data || Object.keys(data).length === 0) {
          this.showError('tentangContent', 'Gagal memuat data Tentang');
          return;
        }
        const name = this._sanitize(data.name || '');
        const location = this._sanitize(data.location || '');
        const description = this._sanitize(data.description || '');
        const skills = this._sanitize(data.skills || '');
        const achievement = this._sanitize(data.achievement || '');
        const imageUrl = this._sanitize(data.image_url || '');
        container.innerHTML =
          '<h2 class="section-title"><span>Tentang</span> Saya</h2>' +
          '<div class="about-grid">' +
          '<div class="about-img">' +
          '<img src="' + imageUrl + '" alt="foto owner" />' +
          '</div>' +
          '<div class="about-desc">' +
          '<h3>' + name + '</h3>' +
          '<p><i class="fas fa-map-pin" style="color:#2563eb;"></i> ' + location + '</p>' +
          '<p>' + description + '</p>' +
          '<p><strong>Keahlian:</strong> ' + skills + '</p>' +
          '<p><i class="fas fa-award" style="color:#2563eb;"></i> ' + achievement + '</p>' +
          '</div>' +
          '</div>';
      },
      renderGallery(data: any) {
        const container = document.getElementById('galleryContent');
        if (!container) return;
        if (!Array.isArray(data) || data.length === 0) {
          this.showError('galleryContent', 'Gagal memuat data Gallery');
          return;
        }
        let html = '<div class="gallery-grid">';
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const name = this._sanitize(item.name || '');
          const desc = this._sanitize(item.desc || '');
          const icon = this._sanitize(item.icon || 'fas fa-code');
          html +=
            '<div class="skill-card">' +
            '<i class="' + icon + '"></i>' +
            '<h4>' + name + '</h4>' +
            '<p>' + desc + '</p>' +
            '</div>';
        }
        html += '</div>';
        container.innerHTML = html;
      },
      renderContact(data: any) {
        const container = document.getElementById('contactContent');
        if (!container) return;
        if (!data || Object.keys(data).length === 0) {
          this.showError('contactContent', 'Gagal memuat data Contact');
          return;
        }
        const email = this._sanitize(data.email || '');
        const phone = this._sanitize(data.phone || '');
        const address = this._sanitize(data.address || '');
        const mapUrl = this._sanitize(data.map_url || '');
        container.innerHTML =
          '<div class="contact-wrap">' +
          '<div class="contact-left">' +
          '<div class="contact-item">' +
          '<i class="fas fa-envelope"></i>' +
          '<span class="contact-text">' + email + '</span>' +
          '</div>' +
          '<div class="contact-item">' +
          '<i class="fas fa-phone-alt"></i>' +
          '<span class="contact-text">' + phone + '</span>' +
          '</div>' +
          '<div class="contact-item">' +
          '<i class="fas fa-map-marker-alt"></i>' +
          '<span class="contact-text">' + address + '</span>' +
          '</div>' +
          '</div>' +
          '<div class="contact-right">' +
          '<iframe src="' + mapUrl + '" allowfullscreen loading="lazy"></iframe>' +
          '</div>' +
          '</div>';
      },
      renderFooter(data: any) {
        const container = document.getElementById('footerContent');
        if (!container) return;
        if (!data || Object.keys(data).length === 0) {
          this.showError('footerContent', 'Gagal memuat data Footer');
          return;
        }
        const copyright = this._sanitize(data.copyright || '');
        const socialLinks = DataStore.getSocialLinks();
        let socialHtml = '';
        const iconMap: Record<string, string> = {
          'github': 'fab fa-github',
          'linkedin': 'fab fa-linkedin-in',
          'twitter': 'fab fa-twitter',
          'instagram': 'fab fa-instagram',
          'facebook': 'fab fa-facebook',
          'youtube': 'fab fa-youtube'
        };
        for (let i = 0; i < socialLinks.length; i++) {
          const link = socialLinks[i];
          const url = this._sanitize(link.url);
          const icon = iconMap[link.key] || 'fas fa-link';
          socialHtml += '<a href="' + url + '" target="_blank" rel="noopener noreferrer"><i class="' + icon + '"></i></a>';
        }
        container.innerHTML =
          '<div class="footer-content">' +
          '<div>&copy; ' + copyright + '</div>' +
          '<div class="footer-social">' + socialHtml + '</div>' +
          '</div>';
      }
    };

    // ============================================================
    // NAVIGATION MODULE
    // ============================================================
    const Navigation = {
      init() {
        const hamburger = document.getElementById('hamburgerBtn');
        const body = document.body;
        if (!hamburger) return;

        let overlay = document.getElementById('mobileOverlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'mobile-menu-overlay';
          overlay.id = 'mobileOverlay';
          body.appendChild(overlay);
        }

        let mobileMenu = document.getElementById('mobileMenu');
        if (!mobileMenu) {
          mobileMenu = document.createElement('div');
          mobileMenu.className = 'mobile-menu';
          mobileMenu.id = 'mobileMenu';
          body.appendChild(mobileMenu);
        }

        const desktopNav = document.getElementById('navLinks');
        let mobileContainer = document.getElementById('mobileNavContainer');
        if (!mobileContainer && desktopNav) {
          mobileContainer = document.createElement('div');
          mobileContainer.id = 'mobileNavContainer';
          const clone = desktopNav.cloneNode(true) as HTMLElement;
          clone.className = 'nav-links-mobile';
          clone.id = 'mobileNavLinks';
          const btnMobile = clone.querySelector('.btn-nav');
          if (btnMobile) {
            btnMobile.className = 'btn-nav-mobile';
            btnMobile.id = 'openModalBtnMobile';
            btnMobile.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pesan';
          }
          mobileContainer.appendChild(clone);
          mobileMenu.appendChild(mobileContainer);
        }

        const mobileLinks = document.querySelectorAll('.mobile-menu a');
        const toggle = () => {
          hamburger.classList.toggle('active');
          mobileMenu!.classList.toggle('open');
          overlay!.classList.toggle('active');
          document.body.style.overflow = mobileMenu!.classList.contains('open') ? 'hidden' : '';
        };
        const closeMenu = () => {
          hamburger.classList.remove('active');
          mobileMenu!.classList.remove('open');
          overlay!.classList.remove('active');
          document.body.style.overflow = '';
        };

        hamburger.onclick = toggle;
        (overlay as HTMLElement).onclick = closeMenu;

        for (let i = 0; i < mobileLinks.length; i++) {
          (mobileLinks[i] as HTMLElement).onclick = closeMenu;
        }

        const anchors = document.querySelectorAll('a[href^="#"]');
        for (let j = 0; j < anchors.length; j++) {
          const anchor = anchors[j] as HTMLElement;
          anchor.onclick = function(e) {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href || '');
            if (target) target.scrollIntoView({
              behavior: 'smooth'
            });
          };
        }
      }
    };

    // ============================================================
    // MODAL MODULE
    // ============================================================
    const ModalModule = {
      _modal: null as HTMLElement | null,
      _closeBtn: null as HTMLElement | null,
      _openBtns: [] as HTMLElement[],
      _onCloseCallback: null as (() => void) | null,
      init(onCloseCallback: () => void) {
        this._modal = document.getElementById('modalForm');
        this._closeBtn = document.getElementById('closeModalBtn');
        const btns = document.querySelectorAll('#openModalBtn, #openModalBtnMobile');
        this._openBtns = Array.prototype.slice.call(btns);
        this._onCloseCallback = onCloseCallback || null;
        if (!this._modal) return;

        for (let i = 0; i < this._openBtns.length; i++) {
          this._openBtns[i].onclick = this.open.bind(this);
        }
        if (this._closeBtn) {
          this._closeBtn.onclick = this.close.bind(this);
        }
        this._modal.onclick = (e) => {
          if (e.target === this._modal) this.close();
        };
      },
      open() {
        if (!this._modal) return;
        this._modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          const hamburger = document.getElementById('hamburgerBtn');
          if (hamburger) hamburger.click();
        }
      },
      close() {
        if (!this._modal) return;
        this._modal.classList.remove('active');
        document.body.style.overflow = '';
        if (this._onCloseCallback) this._onCloseCallback();
      }
    };

    // ============================================================
    // FORM HANDLER MODULE
    // ============================================================
    const FormHandler = {
      _form: null as HTMLFormElement | null,
      _fields: {} as Record<string, HTMLInputElement | HTMLTextAreaElement>,
      _errorEls: {} as Record<string, HTMLElement>,
      _submitBtn: null as HTMLElement | null,
      _btnText: null as HTMLElement | null,
      _btnLoading: null as HTMLElement | null,
      _loadingProgress: null as HTMLElement | null,
      _isSubmitting: false,
      init() {
        this._form = document.getElementById('contactForm') as HTMLFormElement;
        if (!this._form) return;
        this._fields = {
          nama: document.getElementById('nama') as HTMLInputElement,
          email: document.getElementById('email') as HTMLInputElement,
          telpon: document.getElementById('telpon') as HTMLInputElement,
          alamat: document.getElementById('alamat') as HTMLInputElement,
          pesan: document.getElementById('pesan') as HTMLTextAreaElement
        };
        this._errorEls = {
          nama: document.getElementById('namaError')!,
          email: document.getElementById('emailError')!,
          telpon: document.getElementById('telponError')!,
          alamat: document.getElementById('alamatError')!,
          pesan: document.getElementById('pesanError')!
        };
        this._submitBtn = document.getElementById('submitBtn');
        this._btnText = document.getElementById('btnText');
        this._btnLoading = document.getElementById('btnLoading');
        this._loadingProgress = document.getElementById('loadingProgress');

        for (let i = 0; i < CONFIG.FIELD_KEYS.length; i++) {
          const key = CONFIG.FIELD_KEYS[i];
          const field = this._fields[key];
          if (!field) continue;
          field.oninput = this._validateField.bind(this, key);
          field.onblur = this._validateField.bind(this, key);
        }
        if (this._submitBtn) {
          this._submitBtn.onclick = this._handleSubmit.bind(this);
        }
        this._form.onkeypress = (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (this._submitBtn) this._submitBtn.click();
          }
        };
      },
      _validatePhone(phone: string) {
        const cleanPhone = phone.replace(/[\s\-+]/g, '');
        if (!/^\d+$/.test(cleanPhone)) {
          return {
            valid: false,
            message: 'Nomor telepon hanya boleh berisi angka'
          };
        }
        if (cleanPhone.length < 8) {
          return {
            valid: false,
            message: 'Nomor telepon minimal 8 digit'
          };
        }
        if (!cleanPhone.startsWith('0')) {
          return {
            valid: false,
            message: 'Nomor telepon harus diawali dengan 0'
          };
        }
        return {
          valid: true,
          cleanPhone: cleanPhone
        };
      },
      _validateField(key: string) {
        const field = this._fields[key];
        const errorEl = this._errorEls[key];
        if (!field || !errorEl) return false;
        const val = field.value.trim();
        if (key === 'telpon') {
          const result = this._validatePhone(val);
          if (!result.valid) {
            errorEl.textContent = result.message;
            errorEl.classList.add('show');
            return false;
          }
          errorEl.classList.remove('show');
          return true;
        }
        const regex = CONFIG.REGEX[key as keyof typeof CONFIG.REGEX];
        if (!regex) return true;
        if (!regex.test(val)) {
          errorEl.classList.add('show');
          return false;
        }
        errorEl.classList.remove('show');
        return true;
      },
      _resetLoading() {
        this._isSubmitting = false;
        if (this._submitBtn) {
          (this._submitBtn as HTMLButtonElement).disabled = false;
          this._submitBtn.style.background = '#2563eb';
        }
        if (this._btnText) this._btnText.style.display = 'inline';
        if (this._btnLoading) this._btnLoading.style.display = 'none';
        if (this._loadingProgress) this._loadingProgress.style.width = '0%';
      },
      _simulateProgress(callback: () => void) {
        let progress = 0;
        const startTime = Date.now();
        const self = this;
        const speedTest = new Image();
        speedTest.src = 'https://www.google.com/images/phd/px.gif?cache=' + Date.now();
        let isSpeedTested = false;
        let speedFactor = 1;
        speedTest.onload = function() {
          const loadTime = (Date.now() - startTime) / 1000;
          if (loadTime > 1.5) speedFactor = 0.5;
          else if (loadTime < 0.3) speedFactor = 2;
          else speedFactor = 1;
          isSpeedTested = true;
        };
        speedTest.onerror = function() {
          isSpeedTested = true;
        };
        const updateProgress = () => {
          if (!isSpeedTested) {
            setTimeout(updateProgress, 100);
            return;
          }
          const elapsed = (Date.now() - startTime) / 1000;
          const baseProgress = Math.min(elapsed * 25 * speedFactor, 95);
          progress = Math.min(baseProgress, 95);
          if (self._loadingProgress) self._loadingProgress.style.width = progress + '%';
          if (progress < 95) {
            setTimeout(updateProgress, 100);
          } else {
            setTimeout(() => {
              if (self._loadingProgress) self._loadingProgress.style.width = '100%';
              setTimeout(callback, 200);
            }, 200);
          }
        };
        setTimeout(() => {
          if (!isSpeedTested) {
            isSpeedTested = true;
            speedFactor = 1;
          }
          updateProgress();
        }, 500);
      },
      _handleSubmit(e: Event) {
        e.preventDefault();
        if (this._isSubmitting) return;
        const self = this;
        let isValid = true;
        for (let i = 0; i < CONFIG.FIELD_KEYS.length; i++) {
          const key = CONFIG.FIELD_KEYS[i];
          if (!this._validateField(key)) isValid = false;
        }

        const Swal = (window as any).Swal;
        if (!isValid) {
          if (Swal) {
            Swal.fire({
              icon: 'warning',
              title: 'Form tidak lengkap',
              text: 'Mohon periksa kembali semua kolom yang ditandai.',
              confirmButtonColor: '#2563eb'
            });
          }
          return;
        }
        const cleanPhone = this._fields.telpon.value.trim().replace(/[\s\-+]/g, '');
        const payload = {
          nama: this._fields.nama.value.trim(),
          email: this._fields.email.value.trim(),
          telpon: cleanPhone,
          alamat: this._fields.alamat.value.trim(),
          pesan: this._fields.pesan.value.trim()
        };
        this._isSubmitting = true;
        if (this._submitBtn) {
          (this._submitBtn as HTMLButtonElement).disabled = true;
          this._submitBtn.style.background = '#3b82f6';
        }
        if (this._btnText) this._btnText.style.display = 'none';
        if (this._btnLoading) this._btnLoading.style.display = 'inline';
        if (this._loadingProgress) this._loadingProgress.style.width = '0%';

        this._simulateProgress(() => {
          ApiModule.sendMessage(payload)
            .then((result) => {
              if (result && result.success === true) {
                if (Swal) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Pesan terkirim!',
                    text: 'Data berhasil disimpan ke Google Sheet.',
                    confirmButtonColor: '#2563eb',
                    timer: 3000,
                    timerProgressBar: true
                  });
                }
                self._form!.reset();
                for (let j = 0; j < CONFIG.FIELD_KEYS.length; j++) {
                  const errKey = CONFIG.FIELD_KEYS[j];
                  if (self._errorEls[errKey]) {
                    self._errorEls[errKey].classList.remove('show');
                  }
                }
                ModalModule.close();
              } else {
                const errorMessage = result && result.message ? result.message : 'Gagal mengirim pesan';
                if (Swal) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Gagal mengirim',
                    text: errorMessage,
                    confirmButtonColor: '#2563eb'
                  });
                }
              }
            })
            .catch((err) => {
              let errorMessage = 'Terjadi kesalahan, data tidak tersimpan. Coba lagi.';
              if (err.message && err.message.indexOf('Network') !== -1) {
                errorMessage = 'Koneksi bermasalah. Periksa koneksi internet Anda.';
              }
              if (Swal) {
                Swal.fire({
                  icon: 'error',
                  title: 'Gagal mengirim',
                  text: errorMessage,
                  confirmButtonColor: '#2563eb'
                });
              }
            })
            .finally(() => {
              self._resetLoading();
            });
        });
      }
    };

    // ============================================================
    // MAIN APP
    // ============================================================
    const AppObject = {
      loadData() {
        ApiModule.fetchAllData()
          .then((data) => {
            if (data && !data.error) {
              DataStore.setAllData(data);
              if (data.messages && Array.isArray(data.messages)) {
                DataStore.setMessages(data.messages);
              } else {
                DataStore.setMessages([]);
              }
              Renderer.renderLogo(data.beranda);
              Renderer.renderBeranda(data.beranda);
              Renderer.renderTentang(data.tentang);
              Renderer.renderGallery(data.gallery);
              Renderer.renderContact(data.contact);
              Renderer.renderFooter(data.footer);
            } else {
              Renderer.renderLogo(null);
              Renderer.showError('berandaContent', 'Gagal memuat data Beranda');
              Renderer.showError('tentangContent', 'Gagal memuat data Tentang');
              Renderer.showError('galleryContent', 'Gagal memuat data Gallery');
              Renderer.showError('contactContent', 'Gagal memuat data Contact');
              Renderer.showError('footerContent', 'Gagal memuat data Footer');
            }
          });
      },
      init() {
        Navigation.init();
        ModalModule.init(() => {
          FormHandler._resetLoading();
        });
        FormHandler.init();
        this.loadData();
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (backToTopBtn) {
          window.onscroll = () => {
            if (window.scrollY > 400) {
              backToTopBtn.classList.add('show');
            } else {
              backToTopBtn.classList.remove('show');
            }
          };
          backToTopBtn.onclick = () => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
    });
          };
        }
      }
    };

    AppObject.init();

    // Clean up created overlays on unmount to avoid duplication during React Hot Module Replacement
    return () => {
      const overlay = document.getElementById('mobileOverlay');
      if (overlay) overlay.remove();
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu) mobileMenu.remove();
      window.onscroll = null;
    };
  }, []);

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav>
        <div className="container nav-wrapper">
          <div className="logo" id="logoContainer">
            <span className="logo-text">⚡ dev<span style={{ WebkitTextFillColor: '#1e293b' }}>folio</span></span>
          </div>

          <div className="nav-links" id="navLinks">
            <a href="#beranda">Beranda</a>
            <a href="#tentang">Tentang</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Kontak</a>
            <a href="#" className="btn-nav" id="openModalBtn"><i className="fas fa-paper-plane"></i> Pesan</a>
          </div>

          <button className="hamburger" id="hamburgerBtn" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* BERANDA */}
      <section id="beranda">
        <div className="container hero" id="berandaContent">
          <div className="loading-indicator">Memuat data Beranda...</div>
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" style={{ background: '#f1f5f9' }}>
        <div className="container">
          <div id="tentangContent">
            <div className="loading-indicator">Memuat data Tentang...</div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery">
        <div className="container">
          <h2 className="section-title"><span>Gallery</span> · Keahlian</h2>
          <div id="galleryContent">
            <div className="loading-indicator">Memuat data Gallery...</div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 className="section-title"><span>Hubungi</span> Kami</h2>
          <div id="contactContent">
            <div className="loading-indicator">Memuat data Contact...</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container" id="footerContent">
          <div className="loading-indicator">Memuat data Footer...</div>
        </div>
      </footer>

      {/* MODAL */}
      <div className="modal-overlay" id="modalForm">
        <div className="modal-box">
          <div className="modal-header">
            <h2><i className="fas fa-paper-plane"></i> Kirim Pesan</h2>
            <button className="close-modal" id="closeModalBtn">&times;</button>
          </div>
          <div className="modal-body">
            <form id="contactForm">
              <label htmlFor="nama">Nama Lengkap <span className="required">*</span></label>
              <input type="text" id="nama" placeholder="Masukkan nama lengkap" required />
              <div className="error-msg" id="namaError">Nama harus diisi (min 2 huruf).</div>

              <label htmlFor="email">Email <span className="required">*</span></label>
              <input type="email" id="email" placeholder="email@contoh.com" required />
              <div className="error-msg" id="emailError">Email tidak valid.</div>

              <label htmlFor="telpon">Telepon <span className="required">*</span></label>
              <input type="tel" id="telpon" placeholder="082199992754" required />
              <div className="error-msg" id="telponError">Nomor telepon harus diawali dengan 0 dan terdiri dari angka (min 8 digit).</div>

              <label htmlFor="alamat">Alamat <span className="required">*</span></label>
              <input type="text" id="alamat" placeholder="Jl. Contoh No. 1" required />
              <div className="error-msg" id="alamatError">Alamat harus diisi.</div>

              <label htmlFor="pesan">Pesan <span className="required">*</span></label>
              <textarea id="pesan" placeholder="Tulis pesan Anda di sini..." required></textarea>
              <div className="error-msg" id="pesanError">Pesan minimal 5 karakter.</div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn-submit" id="submitBtn">
              <span id="btnText"><i className="fas fa-check-circle"></i> Kirim Pesan</span>
              <span id="btnLoading" style={{ display: 'none' }}>
                <span className="spinner"></span> Mengirim...
              </span>
              <span className="loading-progress" id="loadingProgress" style={{ width: '0%' }}></span>
            </button>
          </div>
        </div>
      </div>

      {/* BACK TO TOP */}
      <button className="back-to-top" id="backToTopBtn" aria-label="Back to top">
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
}

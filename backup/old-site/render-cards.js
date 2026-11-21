(function() {
  if (!window.globalConfig) {
    console.error('全局配置未加载');
    return;
  }
  const { personal, links, projects } = window.globalConfig;

  // ========== 1. 渲染个人信息+邮箱（保持不变） ==========
  const headerContainer = document.querySelector('header .mx-auto.max-w-1024px .flex-col.gap-30px');
  if (headerContainer) {
    headerContainer.innerHTML = `
      <svg width="182" height="182" viewBox="0 0 182 182" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="w-120px h-120px md:w-150px md:h-150px lg:w-180px lg:h-180px">
        <path d="M65.8329 7.61157C81.0982 -2.46432 100.902 -2.46432 116.167 7.61157V7.61157C121.03 10.8211 126.461 13.0708 132.169 14.2397V14.2397C150.088 17.9091 164.091 31.9124 167.76 49.8313V49.8313C168.929 55.539 171.179 60.9705 174.388 65.8329V65.8329C184.464 81.0982 184.464 100.902 174.388 116.167V116.167C171.179 121.03 168.929 126.461 167.76 132.169V132.169C164.091 150.088 150.088 164.091 132.169 167.76V167.76C126.461 168.929 121.03 171.179 116.167 174.388V174.388C100.902 184.464 81.0982 184.464 65.8329 174.388V174.388C60.9705 171.179 55.539 168.929 49.8313 167.76V167.76C31.9124 164.091 17.9091 150.088 14.2397 132.169V132.169C13.0708 126.461 10.8211 121.03 7.61157 116.167V116.167C-2.46432 100.902 -2.46432 81.0982 7.61157 65.8329V65.8329C10.8211 60.9705 13.0708 55.539 14.2397 49.8313V49.8313C17.9091 31.9124 31.9123 17.9091 49.8313 14.2397V14.2397C55.539 13.0708 60.9705 10.8211 65.8329 7.61157V7.61157Z" fill="#C4C4C4"></path>
        <path d="M65.8329 7.61157C81.0982 -2.46432 100.902 -2.46432 116.167 7.61157V7.61157C121.03 10.8211 126.461 13.0708 132.169 14.2397V14.2397C150.088 17.9091 164.091 31.9124 167.76 49.8313V49.8313C168.929 55.539 171.179 60.9705 174.388 65.8329V65.8329C184.464 81.0982 184.464 100.902 174.388 116.167V116.167C171.179 121.03 168.929 126.461 167.76 132.169V132.169C164.091 150.088 150.088 164.091 132.169 167.76V167.76C126.461 168.929 121.03 171.179 116.167 174.388V174.388C100.902 184.464 81.0982 184.464 65.8329 174.388V174.388C60.9705 171.179 55.539 168.929 49.8313 167.76V167.76C31.9124 164.091 17.9091 150.088 14.2397 132.169V132.169C13.0708 126.461 10.8211 121.03 7.61157 116.167V116.167C-2.46432 100.902 -2.46432 81.0982 7.61157 65.8329V65.8329C10.8211 60.9705 13.0708 55.539 14.2397 49.8313V49.8313C17.9091 31.9124 31.9123 17.9091 49.8313 14.2397V14.2397C55.539 13.0708 60.9705 10.8211 65.8329 7.61157V7.61157Z" fill="url(#pattern0)"></path>
        <defs>
          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_14_11" transform="scale(0.00138889)"></use>
          </pattern>
          <image id="image0_14_11" width="720" height="720" xlink:href="${personal.avatar.qlogo}"></image>
        </defs>
      </svg>
      <div class="flex flex-col gap-20px">
        <h1 class="text-36px font-extrabold text-hex-fff">${personal.name}</h1>
        <h2 class="text-18px text-hex-fff text-opacity-50 leading-7">${personal.desc}</h2>
      </div>
      <div class="flex rounded-full bg-hex-383934 py-8px px-8px md:py-10px md:px-10px text-14px">
        <a href="${personal.emailHref}" class="flex gap-15px rounded-full bg-hex-D9EAD7 py-8px px-15px md:py-10px md:px-20px items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ai ai-Envelope">
            <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"></path>
            <path d="M2 8l7.501 6.001a4 4 0 0 0 4.998 0L22 8"></path>
          </svg>
          <span class="text-hex-363C33 font-bold">${personal.email}</span>
        </a>
      </div>
    `;
  }

  // ========== 2. 渲染Links卡片（修复挤压：最小宽度+合理间距） ==========
  const linkContainer = document.querySelector('.link-card-container');
  if (linkContainer && links.length) {
    // 容器样式：固定最小宽度+网格布局，避免挤压
    linkContainer.style.display = 'grid';
    linkContainer.style.gap = '20px';
    linkContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))'; // 最小宽度220px
    linkContainer.style.width = '100%';
    linkContainer.innerHTML = '';

    links.forEach(link => {
      const card = document.createElement('a');
      card.href = link.href;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.className = 'bg-hex-F6F3D4 rounded-20px lg:rounded-30px py-20px px-30px flex gap-20px items-center';
      // 卡片最小宽度+内边距，防止内容挤压
      card.style.minWidth = '200px';
      card.style.boxSizing = 'border-box';

      card.innerHTML = `
        <div class="icon svelte-1kp182d" style="width:40px; height:40px;">
          ${link.iconSvg.replace(/width="200" height="200"/, 'width="40" height="40"')}
        </div>
        <div class="flex flex-col gap-5px">
          <span class="font-bold text-18px">${link.name}</span>
          <span class="font-semibold tracking-wider text-11px opacity-70">${link.subname}</span>
        </div>
      `;
      linkContainer.appendChild(card);
    });
  }

  // ========== 3. 渲染Projects卡片（修复挤压：最小宽度+合理间距） ==========
  const projectContainer = document.querySelector('.project-card-container');
  if (projectContainer && projects.length) {
    // 容器样式：固定最小宽度+网格布局
    projectContainer.style.display = 'grid';
    projectContainer.style.gap = '20px';
    projectContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(240px, 1fr))'; // 最小宽度240px
    projectContainer.style.width = '100%';
    projectContainer.innerHTML = '';

    projects.forEach(proj => {
      const card = document.createElement('a');
      card.href = proj.href;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.className = 'bg-hex-F6F3D4 flex flex-col rounded-40px overflow-hidden';
      // 卡片最小宽度+盒模型，防止挤压
      card.style.minWidth = '220px';
      card.style.boxSizing = 'border-box';

      card.innerHTML = `
        <img class="h-100px object-cover w-full" src="${proj.imgSrc}" alt="${proj.imgAlt}" loading="lazy">
        <div class="uppercase flex flex-col p-20px px-25px flex-1 text-hex-000">
          <span class="font-bold">${proj.name}</span>
          <span class="font-semibold text-xs leading-5 opacity-70">${proj.desc}</span>
        </div>
      `;
      projectContainer.appendChild(card);
    });
  }
})();

/**
 * MCP Shrimp Task Manager 웹사이트 메인 스크립트
 */

// 페이지 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", function () {
  // 스크롤 애니메이션 초기화
  initAOS();

  // 모바일 메뉴 초기화
  initMobileMenu();

  // 코드 하이라이트와 복사 기능 초기화
  initCodeBlocks();

  // 부드러운 스크롤 기능
  initSmoothScroll();

  // 히어로 섹션 효과
  initHeroEffects();

  // 문제점과 해결방안 섹션 효과
  initPainPointsEffects();

  // 핵심 기능 전시 섹션 효과
  initFeaturesEffects();

  // 작업 흐름 전시 섹션 효과
  initWorkflowEffects();

  // 설치와 설정 섹션 기능 초기화
  initInstallationSection();

  // 페이지 스크롤 위치를 감지하여 맨 위로 가기 버튼 표시
  initScrollToTopButton();

  // 반응형 이미지 지연 로딩 초기화
  initLazyLoading();

  // 페이지 진입 애니메이션 초기화
  initPageEntranceAnimation();

  // 다국어 기능
  initMultiLanguage();
});

// 설치 섹션으로 스크롤하는 함수
function scrollToInstallation() {
  const installationSection = document.getElementById('installation');
  if (installationSection) {
    const headerHeight = document.querySelector("header").offsetHeight;
    const targetPosition = installationSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * AOS 스크롤 애니메이션 라이브러리 초기화
 */
function initAOS() {
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    mirror: true,
    disable: function () {
      // 사용자 선호 설정에 따라 저성능 기기에서만 애니메이션 비활성화
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
  });

  // 창 크기 조정 시 AOS를 다시 초기화하여 올바른 트리거 위치 보장
  window.addEventListener("resize", function () {
    AOS.refresh();
  });
}

/**
 * 모바일 메뉴 초기화
 */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();

      // 전환 효과를 지원하기 위해 먼저 hidden 클래스 제거
      if (mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.remove("hidden");

        // DOM 업데이트를 기다린 후 visible 클래스 추가하여 전환 효과 시작
        setTimeout(() => {
          mobileMenu.classList.add("visible");
        }, 10);
      } else {
        // 먼저 visible 클래스 제거하여 전환 효과 트리거
        mobileMenu.classList.remove("visible");

        // 전환이 완료된 후 메뉴 숨기기
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300); // 300ms는 CSS 전환 시간과 일치
      }
    });

    // 메뉴 항목 클릭 후 메뉴 닫기
    const menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("visible");

        // 전환이 완료된 후 메뉴 숨기기
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
      });
    });

    // 메뉴 외부 영역 클릭 시 메뉴 닫기
    document.addEventListener("click", function (e) {
      if (
        !menuToggle.contains(e.target) &&
        !mobileMenu.contains(e.target) &&
        !mobileMenu.classList.contains("hidden")
      ) {
        mobileMenu.classList.remove("visible");

        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
      }
    });
  }
}

/**
 * 히어로 섹션 효과 초기화
 */
function initHeroEffects() {
  // 히어로 섹션 가져오기
  const heroSection = document.getElementById("hero");
  if (!heroSection) return;

  // 부동 요소에 애니메이션 추가
  const decorElements = heroSection.querySelectorAll(".absolute");
  decorElements.forEach((elem, index) => {
    elem.style.setProperty("--animation-order", index + 1);

    // 페이지 로드 후 요소를 하나씩 보여주는 애니메이션
    setTimeout(() => {
      elem.style.opacity = "0.8";
    }, (index + 1) * 200);
  });

  // 시차 스크롤 효과 추가
  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    // 사용자가 히어로 섹션을 스크롤 할 때 효과 적용
    if (scrollTop <= heroHeight) {
      const scrollPercentage = scrollTop / heroHeight;

      // 히어로 섹션 투명도 조절
      heroSection.style.opacity = 1 - scrollPercentage * 0.8;

      // 제목 이동 효과
      const heroTitle = heroSection.querySelector("h1");
      if (heroTitle) {
        heroTitle.style.transform = `translateY(${scrollPercentage * 50}px)`;
      }
    }
  });

  // 마우스 움직임에 따른 시차 효과 추가
  heroSection.addEventListener("mousemove", function (e) {
    // 큰 화면에서만 효과 적용
    if (window.innerWidth >= 768) {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

      // 히어로 섹션 내의 이미지 요소 가져오기
      const heroImage = heroSection.querySelector("img");
      if (heroImage) {
        heroImage.style.transform = `translate(${moveX * 2}px, ${
          moveY * 2
        }px) scale(1.02)`;
      }

      // 히어로 섹션 내의 장식 요소 가져오기
      decorElements.forEach((elem, index) => {
        // 다른 이동 비율을 사용하여 계층감 추가
        const factorX = (index + 1) * 0.03;
        const factorY = (index + 1) * 0.02;
        elem.style.transform = `translate(${moveX * factorX}px, ${
          moveY * factorY
        }px)`;
      });
    }
  });

  // 마우스 떠날 때 요소 위치 재설정
  heroSection.addEventListener("mouseleave", function () {
    const heroImage = heroSection.querySelector("img");
    if (heroImage) {
      heroImage.style.transform = "";
    }

    decorElements.forEach((elem) => {
      elem.style.transform = "";
    });
  });

  // 로고 애니메이션 효과
  const logo = document.querySelector("header nav img");
  if (logo) {
    // 네비게이션 로고가 페이지 로드 시 약간의 회전 애니메이션
    logo.style.transition = "transform 1s ease-out";
    logo.style.transform = "rotate(0deg)";

    setTimeout(() => {
      logo.style.transform = "rotate(5deg)";
      setTimeout(() => {
        logo.style.transform = "rotate(0deg)";
      }, 500);
    }, 1500);
  }
}

/**
 * 문제점과 해결방안 섹션 효과 초기화
 */
function initPainPointsEffects() {
  const painPointsSection = document.getElementById("pain-points");
  if (!painPointsSection) return;

  // 모든 카드 가져오기
  const cards = painPointsSection.querySelectorAll(
    ".rounded-lg.overflow-hidden"
  );

  // 각 카드에 지연 나타나는 애니메이션 추가
  cards.forEach((card, index) => {
    card.setAttribute("data-aos", "fade-up");
    card.setAttribute("data-aos-delay", (index * 150).toString());
  });

  // 각 카드에 마우스 진입과 떠날 때 효과 추가
  cards.forEach((card, index) => {
    // 문제점과 해결방안 섹션 블록 가져오기
    const painIcon = card.querySelector(".p-6 img");
    const solutionIcon = card.querySelector(".p-4 img");
    const arrowIcon = card.querySelector(".h-8.w-8.text-green-500");

    // 마우스 진입 효과
    card.addEventListener("mouseenter", function () {
      // 지연된 애니메이션으로 시퀀스 애니메이션 효과 추가
      if (painIcon) {
        setTimeout(() => {
          painIcon.style.transform = "scale(1.1) rotate(5deg)";
        }, 100);
      }

      if (arrowIcon) {
        setTimeout(() => {
          arrowIcon.style.transform = "translateY(8px)";
        }, 200);
      }

      if (solutionIcon) {
        setTimeout(() => {
          solutionIcon.style.transform = "scale(1.1) rotate(-5deg)";
        }, 300);
      }

      // 발광 효과 추가
      card.style.boxShadow =
        "0 20px 30px rgba(0, 0, 0, 0.15), 0 0 15px rgba(59, 130, 246, 0.3)";
    });

    // 마우스 떠날 때 효과
    card.addEventListener("mouseleave", function () {
      if (painIcon) painIcon.style.transform = "";
      if (arrowIcon) arrowIcon.style.transform = "";
      if (solutionIcon) solutionIcon.style.transform = "";

      // 발광 효과 제거
      card.style.boxShadow = "";
    });
  });

  // 시차 스크롤 효과 추가
  window.addEventListener("scroll", function () {
    // 큰 화면에서만 효과 적용
    if (window.innerWidth >= 768) {
      const scrollPosition = window.scrollY;
      const sectionTop = painPointsSection.offsetTop;
      const sectionHeight = painPointsSection.offsetHeight;

      // 사용자가 해당 섹션을 스크롤 할 때 효과 적용
      if (
        scrollPosition > sectionTop - window.innerHeight &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        cards.forEach((card, index) => {
          // 부분적인 스크롤 위치에 따른 상대적인 위치
          const relativeScroll =
            (scrollPosition - (sectionTop - window.innerHeight)) /
            (sectionHeight + window.innerHeight);
          // 카드 위치에 따른 오프셋 계산
          const offset = Math.sin(relativeScroll * Math.PI + index * 0.5) * 15;

          // 인덱스에 따른 다른 오프셋 방향 설정
          if (index % 2 === 0) {
            card.style.transform = `translateY(${offset}px)`;
          } else {
            card.style.transform = `translateY(${-offset}px)`;
          }
        });
      }
    }
  });
}

/**
 * 코드 블록 기능 초기화
 */
function initCodeBlocks() {
  // Prism.js가 로드되었는지 확인
  if (typeof Prism !== "undefined") {
    // 코드 하이라이트 적용
    Prism.highlightAll();
  }

  // 코드 예제 탭 전환 기능 초기화
  initCodeTabSwitcher();

  // 선택 가능: 타이핑 효과 추가
  initTypingEffect();
}

/**
 * 코드 예제 탭 전환 기능 초기화
 */
function initCodeTabSwitcher() {
  const tabButtons = document.querySelectorAll(".code-tab-btn");
  const contentSections = document.querySelectorAll(".code-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 목표 콘텐츠 ID 가져오기
      const targetId = btn.getAttribute("data-target");

      // 모든 버튼의 활성 상태 제거
      tabButtons.forEach((b) => {
        b.classList.remove("active", "bg-blue-50", "text-blue-600");
        b.classList.add("hover:bg-blue-50");
      });

      // 현재 버튼 활성 상태 추가
      btn.classList.add("active", "bg-blue-50", "text-blue-600");

      // 모든 콘텐츠 숨기기
      contentSections.forEach((section) => {
        section.classList.add("hidden");
      });

      // 목표 콘텐츠 표시
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");

        // 활성 콘텐츠 영역의 코드 하이라이트 보장
        const codeBlocks = targetSection.querySelectorAll("code");
        if (typeof Prism !== "undefined" && codeBlocks.length) {
          codeBlocks.forEach((block) => {
            Prism.highlightElement(block);
          });
        }
      }
    });
  });
}

/**
 * 타이핑 효과 초기화 (선택 기능)
 */
function initTypingEffect() {
  // 타이핑 효과 활성화 여부를 확인 (URL 매개변수를 통해 제어 가능)
  const urlParams = new URLSearchParams(window.location.search);
  const enableTyping = urlParams.get("typing") === "true";

  if (!enableTyping) return;

  const codeBlocks = document.querySelectorAll("#examples code");
  if (!codeBlocks.length) return;

  codeBlocks.forEach((codeBlock) => {
    const originalText = codeBlock.textContent;
    codeBlock.textContent = "";

    let charIndex = 0;
    const typingSpeed = 30; // 각 문자 사이 간격(밀리초)

    // 먼저 원본 코드를 숨기고 타이핑 효과 시작
    codeBlock.parentElement.classList.add("typing-in-progress");

    // 창 진입 시 타이핑 효과 시작
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startTyping();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(codeBlock.parentElement);

    function startTyping() {
      const typingInterval = setInterval(() => {
        if (charIndex < originalText.length) {
          codeBlock.textContent += originalText.charAt(charIndex);
          charIndex++;

          // 코드 블록을 자동으로 스크롤링하여 커서 위치 트래킹
          codeBlock.parentElement.scrollTop =
            codeBlock.parentElement.scrollHeight;

          // 동적으로 문법 하이라이트 적용
          if (typeof Prism !== "undefined") {
            Prism.highlightElement(codeBlock);
          }
        } else {
          clearInterval(typingInterval);
          codeBlock.parentElement.classList.remove("typing-in-progress");
        }
      }, typingSpeed);
    }
  });
}

/**
 * 부드러운 스크롤 초기화
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // 단순 "#" 링크가 아닌 경우에만 적용
      if (href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          // 목표 요소의 위치와 고정 네비게이션 높이를 고려하여 계산
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

/**
 * 핵심 기능 전시 섹션 효과 초기화
 */
function initFeaturesEffects() {
  const featuresSection = document.getElementById("features");
  if (!featuresSection) return;

  // 모든 기능 카드 가져오기
  const featureCards = featuresSection.querySelectorAll(".rounded-lg");

  // 각 카드에 마우스 오버 효과 추가
  featureCards.forEach((card, index) => {
    // 카드 내의 아이콘과 제목 가져오기
    const featureIcon = card.querySelector(".p-6 img");
    const featureTitle = card.querySelector("h3");

    // 마우스 진입 효과
    card.addEventListener("mouseenter", function () {
      if (featureIcon) {
        featureIcon.style.transform = "scale(1.2) rotate(5deg)";
        featureIcon.style.transition = "transform 0.5s ease";
      }

      if (featureTitle) {
        featureTitle.style.transform = "translateY(-5px)";
        featureTitle.style.transition = "transform 0.3s ease";
      }
    });

    // 마우스 떠날 때 효과
    card.addEventListener("mouseleave", function () {
      if (featureIcon) {
        featureIcon.style.transform = "";
      }

      if (featureTitle) {
        featureTitle.style.transform = "";
      }
    });

    // 클릭 효과 - 약간의 튕김 효과 추가
    card.addEventListener("click", function () {
      card.style.transform = "scale(0.95)";
      setTimeout(() => {
        card.style.transform = "";
      }, 200);
    });
  });

  // 스크롤 시차 효과 추가
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // 효과 발동 범위 계산
    const sectionTop = featuresSection.offsetTop;
    const sectionHeight = featuresSection.offsetHeight;
    const triggerStart = sectionTop - windowHeight;
    const triggerEnd = sectionTop + sectionHeight;

    // 스크롤 위치에 따른 시차 효과 계산
    if (scrollPosition > triggerStart && scrollPosition < triggerEnd) {
      const scrollProgress =
        (scrollPosition - triggerStart) / (triggerEnd - triggerStart);

      // 다양한 시차 효과 적용
      featureCards.forEach((card, index) => {
        const delayFactor = (index % 3) * 0.1;
        const moveY = Math.sin((scrollProgress + delayFactor) * Math.PI) * 15;

        // 시차 효과 적용
        card.style.transform = `translateY(${moveY}px)`;
      });
    }
  });
}

/**
 * 작업 흐름 전시 섹션 효과 초기화
 */
function initWorkflowEffects() {
  // 단계 상세 팝업 기능
  initWorkflowModal();

  // 데스크탑 버전 시간 프레임에 연결선 애니메이션 추가
  animateWorkflowConnections();

  // 단계 아이콘에 상호작용 효과 추가
  addWorkflowIconInteractions();
}

/**
 * 작업 흐름 상세 팝업 초기화
 */
function initWorkflowModal() {
  const modal = document.getElementById("workflow-detail-modal");
  const closeBtn = document.getElementById("close-modal");
  const closeBtnAlt = document.getElementById("close-modal-btn");
  const detailLinks = document.querySelectorAll(
    ".workflow-detail-link, .workflow-step"
  );
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");

  if (!modal || !closeBtn || !detailLinks.length) return;

  // 작업 흐름 단계 상세 데이터
  const workflowDetails = {
    en: {
      1: {
        title: "Task Planning",
        content: `
          <p>The task planning stage is the initial phase where AI assistants define project scope, set goals, and establish success criteria.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Clarify project requirements and constraints</li>
            <li>Set clear objectives and define measurable success criteria</li>
            <li>Establish project boundaries and identify stakeholders</li>
            <li>Create a high-level plan with timeline estimates</li>
            <li>Optionally reference existing tasks for continuous planning</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Comprehensive task description</li>
            <li>Clear success criteria</li>
            <li>Technical requirements and constraints</li>
          </ul>
          <p class="mt-4">This stage lays the foundation for all subsequent work, ensuring that both the AI assistant and the user have a shared understanding of what needs to be accomplished.</p>
        `,
      },
      2: {
        title: "In-depth Analysis",
        content: `
          <p>The in-depth analysis stage involves a thorough examination of the requirements and technical landscape to develop a viable implementation strategy.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Analyze requirements and identify technical challenges</li>
            <li>Evaluate technical feasibility and potential risks</li>
            <li>Research best practices and available solutions</li>
            <li>Systematically review existing codebase if applicable</li>
            <li>Develop initial implementation concepts</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Technical feasibility assessment</li>
            <li>Risk identification and mitigation strategies</li>
            <li>Initial implementation approach</li>
            <li>Pseudocode or architectural diagrams where appropriate</li>
          </ul>
          <p class="mt-4">This stage ensures that the proposed solution is technically sound and addresses all requirements before proceeding to implementation.</p>
        `,
      },
      3: {
        title: "Solution Reflection",
        content: `
          <p>The solution reflection stage involves critical review and optimization of the proposed approach before implementation.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Critically review the analysis results and proposed solutions</li>
            <li>Identify potential gaps, edge cases, or inefficiencies</li>
            <li>Consider alternative approaches and their trade-offs</li>
            <li>Evaluate solution against best practices and design principles</li>
            <li>Refine implementation strategy based on insights</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Optimized solution design</li>
            <li>Documented considerations and trade-offs</li>
            <li>Refined implementation strategy</li>
          </ul>
          <p class="mt-4">This reflective process helps catch potential issues early and ensures the chosen approach is optimal before investing in implementation.</p>
        `,
      },
      4: {
        title: "Task Decomposition",
        content: `
          <p>The task decomposition stage breaks down complex tasks into manageable, atomic subtasks with clear dependencies and execution order.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Break down complex tasks into smaller, manageable units</li>
            <li>Establish clear dependencies between subtasks</li>
            <li>Define scope and acceptance criteria for each subtask</li>
            <li>Assign priority levels and estimate complexity</li>
            <li>Create a logical execution sequence</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Supported Update Modes:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Append:</strong> Keep all existing tasks and add new ones</li>
            <li><strong>Overwrite:</strong> Clear all uncompleted tasks and completely replace them, while preserving completed tasks</li>
            <li><strong>Selective:</strong> Intelligently update existing tasks based on task names, preserving tasks not in the list</li>
            <li><strong>Clear All Tasks:</strong> Remove all tasks and create a backup</li>
          </ul>
          <p class="mt-4">This structured approach makes complex projects manageable by creating a clear roadmap of small, achievable steps.</p>
        `,
      },
      5: {
        title: "Task Execution",
        content: `
          <p>The task execution stage involves implementing specific tasks according to the predetermined plan, with a focus on quality and adherence to requirements.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Select tasks for execution based on dependencies and priorities</li>
            <li>Implement solutions following the implementation guide</li>
            <li>Follow coding standards and best practices</li>
            <li>Handle edge cases and error conditions</li>
            <li>Document implementation decisions and rationale</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Execution Process:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Prepare necessary resources and environment</li>
            <li>Follow the implementation guide step by step</li>
            <li>Monitor progress and handle any unexpected issues</li>
            <li>Maintain code quality and documentation</li>
          </ul>
          <p class="mt-4">This stage transforms plans into concrete results, implementing the solutions designed in earlier stages.</p>
        `,
      },
      6: {
        title: "Result Verification",
        content: `
          <p>The result verification stage ensures that implemented tasks meet all requirements and quality standards before being marked as complete.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Verify that all requirements have been implemented</li>
            <li>Check for adherence to technical standards and best practices</li>
            <li>Test edge cases and error handling</li>
            <li>Review code quality and documentation</li>
            <li>Validate against the verification criteria defined for the task</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Verification Checklist:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Functional correctness: Does it work as expected?</li>
            <li>Completeness: Are all requirements addressed?</li>
            <li>Quality: Does it meet coding standards and best practices?</li>
            <li>Performance: Does it operate efficiently?</li>
            <li>Documentation: Is the implementation well-documented?</li>
          </ul>
          <p class="mt-4">This thorough verification process ensures high-quality deliverables that fully satisfy requirements.</p>
        `,
      },
      7: {
        title: "Task Completion",
        content: `
          <p>The task completion stage formally marks tasks as complete, generates detailed completion reports, and updates the status of dependent tasks.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Formally mark task as completed after successful verification</li>
            <li>Generate a comprehensive completion report</li>
            <li>Update the status of dependent tasks</li>
            <li>Archive relevant information for future reference</li>
            <li>Communicate completion to stakeholders</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Completion Report Contents:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Summary of completed work</li>
            <li>Implementation highlights and key decisions</li>
            <li>Any notable challenges encountered and their solutions</li>
            <li>Recommendations for future work or improvements</li>
          </ul>
          <p class="mt-4">The completion stage ensures proper closure of tasks, maintains workflow continuity, and builds institutional knowledge for future projects.</p>
        `,
      },
    },
    "ko": {
      1: {
        title: "작업 계획",
        content: `
          <p>작업 계획 단계는 AI 조수가 프로젝트 범위를 정의하고, 목표를 설정하며, 성공 기준을 수립하는 초기 단계입니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>프로젝트 요구사항 및 제약 조건 명확화</li>
            <li>명확한 목표 설정 및 측정 가능한 성공 기준 정의</li>
            <li>프로젝트 범위 설정 및 이해관계자 식별</li>
            <li>타임라인 추정치를 포함한 상위 수준 계획 수립</li>
            <li>지속적인 계획을 위해 기존 작업 참조(선택 사항)</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">산출물:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>포괄적인 작업 설명</li>
            <li>명확한 성공 기준</li>
            <li>기술적 요구사항 및 제약 조건</li>
          </ul>
          <p class="mt-4">이 단계는 모든 후속 작업의 기초를 마련하여 AI 조수와 사용자 모두가 달성해야 할 목표에 대해 공통된 이해를 갖도록 보장합니다.</p>
        `,
      },
      2: {
        title: "심층 분석",
        content: `
          <p>심층 분석 단계에서는 실행 가능한 구현 전략을 개발하기 위해 요구사항과 기술 환경을 철저히 검토합니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>요구사항 분석 및 기술적 과제 식별</li>
            <li>기술적 타당성 및 잠재적 위험 평가</li>
            <li>모범 사례 및 사용 가능한 솔루션 연구</li>
            <li>해당하는 경우 기존 코드베이스를 체계적으로 검토</li>
            <li>초기 구현 개념 개발</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">산출물:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>기술적 타당성 평가</li>
            <li>위험 식별 및 완화 전략</li>
            <li>초기 구현 접근 방식</li>
            <li>적절한 경우 의사 코드 또는 아키텍처 다이어그램</li>
          </ul>
          <p class="mt-4">이 단계는 제안된 솔루션이 기술적으로 타당하고 구현을 진행하기 전에 모든 요구사항을 해결하는지 확인합니다.</p>
        `,
      },
      3: {
        title: "솔루션 성찰",
        content: `
          <p>솔루션 성찰 단계에서는 구현 전에 제안된 접근 방식을 비판적으로 검토하고 최적화합니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>분석 결과 및 제안된 솔루션을 비판적으로 검토</li>
            <li>잠재적인 격차, 예외 사례 또는 비효율성 식별</li>
            <li>대체 접근 방식 및 장단점 고려</li>
            <li>모범 사례 및 설계 원칙에 따라 솔루션 평가</li>
            <li>통찰력을 바탕으로 구현 전략 구체화</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">산출물:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>최적화된 솔루션 설계</li>
            <li>고려 사항 및 장단점 문서화</li>
            <li>구체화된 구현 전략</li>
          </ul>
          <p class="mt-4">이 성찰 과정은 잠재적인 문제를 조기에 발견하고 구현에 투자하기 전에 선택한 접근 방식이 최적인지 확인하는 데 도움이 됩니다.</p>
        `,
      },
      4: {
        title: "작업 분해",
        content: `
          <p>작업 분해 단계는 복잡한 작업을 관리 가능하고 원자적인 하위 작업으로 나누고 명확한 종속성 및 실행 순서를 설정합니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>복잡한 작업을 더 작고 관리 가능한 단위로 분해</li>
            <li>하위 작업 간의 명확한 종속성 설정</li>
            <li>각 하위 작업의 범위 및 수용 기준 정의</li>
            <li>우선순위 수준 할당 및 복잡성 추정</li>
            <li>논리적 실행 순서 생성</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">지원되는 업데이트 모드:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>추가(append):</strong> 기존 모든 작업을 유지하고 새 작업을 추가합니다.</li>
            <li><strong>덮어쓰기(overwrite):</strong> 완료되지 않은 모든 작업을 지우고 완료된 작업을 유지하면서 완전히 교체합니다.</li>
            <li><strong>선택적 업데이트(selective):</strong> 작업 이름을 기반으로 기존 작업을 지능적으로 업데이트하고 목록에 없는 작업은 유지합니다.</li>
            <li><strong>모든 작업 지우기(clearAllTasks):</strong> 모든 작업을 제거하고 백업을 생성합니다.</li>
          </ul>
          <p class="mt-4">이 구조화된 접근 방식은 작고 달성 가능한 단계의 명확한 로드맵을 만들어 복잡한 프로젝트를 관리 가능하게 만듭니다.</p>
        `,
      },
      5: {
        title: "작업 실행",
        content: `
          <p>작업 실행 단계는 사전에 결정된 계획에 따라 특정 작업을 구현하며, 품질 및 요구사항 준수에 중점을 둡니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>종속성 및 우선순위에 따라 실행할 작업 선택</li>
            <li>구현 가이드에 따라 솔루션 구현</li>
            <li>코딩 표준 및 모범 사례 준수</li>
            <li>예외 사례 및 오류 조건 처리</li>
            <li>구현 결정 및 근거 문서화</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">실행 프로세스:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>필요한 리소스 및 환경 준비</li>
            <li>구현 가이드를 단계별로 따름</li>
            <li>진행 상황 모니터링 및 예기치 않은 문제 처리</li>
            <li>코드 품질 및 문서 유지</li>
          </ul>
          <p class="mt-4">이 단계는 계획을 구체적인 결과로 전환하여 이전 단계에서 설계된 솔루션을 구현합니다.</p>
        `,
      },
      6: {
        title: "결과 검증",
        content: `
          <p>결과 검증 단계는 구현된 작업이 완료로 표시되기 전에 모든 요구사항과 품질 표준을 충족하는지 확인합니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>모든 요구사항이 구현되었는지 확인</li>
            <li>기술 표준 및 모범 사례 준수 여부 확인</li>
            <li>예외 사례 및 오류 처리 테스트</li>
            <li>코드 품질 및 문서 검토</li>
            <li>작업에 대해 정의된 검증 기준에 따라 검증</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">검증 체크리스트:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>기능적 정확성: 예상대로 작동하는가?</li>
            <li>완전성: 모든 요구사항이 해결되었는가?</li>
            <li>품질: 코딩 표준 및 모범 사례를 충족하는가?</li>
            <li>성능: 효율적으로 작동하는가?</li>
            <li>문서: 구현이 잘 문서화되었는가?</li>
          </ul>
          <p class="mt-4">이 철저한 검증 과정은 요구사항을 완전히 충족하는 고품질 결과물을 보장합니다.</p>
        `,
      },
      7: {
        title: "작업 완료",
        content: `
          <p>작업 완료 단계는 작업을 공식적으로 완료로 표시하고, 상세한 완료 보고서를 생성하며, 종속 작업의 상태를 업데이트합니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>성공적인 검증 후 작업을 공식적으로 완료로 표시</li>
            <li>포괄적인 완료 보고서 생성</li>
            <li>종속 작업의 상태 업데이트</li>
            <li>향후 참조를 위해 관련 정보 보관</li>
            <li>이해관계자에게 완료 사실 전달</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">완료 보고서 내용:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>완료된 작업 요약</li>
            <li>구현 하이라이트 및 주요 결정</li>
            <li>발생한 주목할 만한 과제 및 해결책</li>
            <li>향후 작업 또는 개선을 위한 권장 사항</li>
          </ul>
          <p class="mt-4">완료 단계는 작업의 적절한 마무리를 보장하고, 워크플로우 연속성을 유지하며, 향후 프로젝트를 위한 조직적 지식을 구축합니다.</p>
        `,
      },
    },
  };

  // 詳情鏈接 클릭 시 팝업 열기
  detailLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const stepIndex = parseInt(this.getAttribute("data-step"));
      const lang = localStorage.getItem("preferred-language") || "en";
      if (stepIndex >= 0 && workflowDetails[lang][stepIndex]) {
        modalTitle.textContent = workflowDetails[lang][stepIndex].title;
        modalContent.innerHTML = workflowDetails[lang][stepIndex].content;
        modal.classList.remove("hidden");
        modal.classList.add("active");
      }
    });
  });

  // 팝업 닫기
  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("active");
  }

  closeBtn.addEventListener("click", closeModal);
  closeBtnAlt.addEventListener("click", closeModal);

  // 팝업 외부 클릭 시 닫기
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/**
 * 작업 흐름 시간 프레임에 연결선 애니메이션 추가
 */
function animateWorkflowConnections() {
  const desktopTimeline = document.querySelector(
    "#workflow .hidden.md\\:block"
  );
  if (!desktopTimeline) return;

  // 시간 프레임이 화면에 진입할 때 애니메이션 트리거
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const steps = entry.target.querySelectorAll(".workflow-step");

          steps.forEach((step, index) => {
            setTimeout(() => {
              step.classList.add("animated");
            }, index * 200);
          });

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(desktopTimeline);
}

/**
 * 작업 흐름 단계 아이콘에 상호작용 효과 추가
 */
function addWorkflowIconInteractions() {
  const workflowIcons = document.querySelectorAll(
    ".workflow-icon, .workflow-icon-mobile"
  );

  workflowIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      const img = this.querySelector("img");
      if (img) {
        img.style.transform = "scale(1.2) rotate(5deg)";
        img.style.transition = "transform 0.3s ease";
      }
    });

    icon.addEventListener("mouseleave", function () {
      const img = this.querySelector("img");
      if (img) {
        img.style.transform = "";
      }
    });

    // 클릭 효과 추가
    icon.addEventListener("click", function () {
      const link =
        this.parentNode.querySelector(".workflow-detail-link") ||
        this.closest(".flex").querySelector(".workflow-detail-link");

      if (link) {
        link.click();
      }
    });
  });
}

/**
 * 설치와 설정 섹션 기능 초기화
 */
function initInstallationSection() {
  // 설치 방식 탭 전환 초기화
  initInstallTabs();

  // 커서 IDE 설정 탭 전환 초기화
  initCursorTabs();

  // 명령행 복사 버튼 초기화
  initCommandCopyButtons();

  // 설치 카드 애니메이션 효과 추가
  initInstallCardsAnimation();
}

/**
 * 설치 방식 탭 전환 초기화
 */
function initInstallTabs() {
  const tabButtons = document.querySelectorAll(".install-tab-btn");
  const contentSections = document.querySelectorAll(".install-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 모든 활성 상태 제거
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      contentSections.forEach((section) => section.classList.add("hidden"));

      // 현재 활성 상태 설정
      button.classList.add("active");
      const targetId = button.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  });
}

/**
 * 커서 IDE 설정 탭 전환 초기화
 */
function initCursorTabs() {
  const tabButtons = document.querySelectorAll(".cursor-tab-btn");
  const contentSections = document.querySelectorAll(".cursor-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 모든 활성 상태 제거
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      contentSections.forEach((section) => section.classList.add("hidden"));

      // 현재 활성 상태 설정
      button.classList.add("active");
      const targetId = button.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  });
}

/**
 * 명령행 복사 버튼 초기화
 */
function initCommandCopyButtons() {
  const copyButtons = document.querySelectorAll(".copy-cmd-btn");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const command = button.getAttribute("data-command");
      if (!command) return;

      try {
        await navigator.clipboard.writeText(command);

        // 버튼 텍스트 업데이트
        const originalText = button.textContent.trim();
        button.textContent = "복사됨!";
        button.classList.add("bg-gray-600");
        button.classList.remove(
          "bg-blue-600",
          "bg-green-600",
          "bg-purple-600",
          "hover:bg-blue-700",
          "hover:bg-green-700",
          "hover:bg-purple-700"
        );

        // 원래 상태로 복귀
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("bg-gray-600");

          // 버튼 색상에 따라 스타일 복귀
          if (button.classList.contains("copy-cmd-btn")) {
            if (button.closest("#smithery-install")) {
              button.classList.add("bg-blue-600", "hover:bg-blue-700");
            } else if (button.closest("#manual-install")) {
              button.classList.add("bg-green-600", "hover:bg-green-700");
            } else if (button.closest("#cursor-config")) {
              button.classList.add("bg-purple-600", "hover:bg-purple-700");
            }
          }
        }, 2000);
      } catch (err) {
        console.error("복사 명령 실패:", err);
        button.textContent = "복사 실패";
      }
    });
  });
}

/**
 * 설치 카드 애니메이션 효과 추가
 */
function initInstallCardsAnimation() {
  const installCards = document.querySelectorAll("#installation .grid > div");

  installCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px)";
      card.style.boxShadow =
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";

      // 카드 내의 아이콘 찾아 애니메이션 추가
      const icon = card.querySelector("svg");
      if (icon) {
        icon.style.transform = "scale(1.2)";
        icon.style.transition = "transform 0.3s ease";
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";

      // 아이콘 복귀
      const icon = card.querySelector("svg");
      if (icon) {
        icon.style.transform = "";
      }
    });
  });
}

/**
 * 페이지 스크롤 위치를 감지하여 맨 위로 가기 버튼 표시
 */
function initScrollToTopButton() {
  // 맨 위로 가기 버튼 요소 생성
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.id = "scrollToTop";
  scrollToTopBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg>';
  scrollToTopBtn.className =
    "fixed bottom-5 right-5 bg-blue-600 text-white p-2 rounded-full shadow-lg transform scale-0 transition-transform duration-300";
  scrollToTopBtn.setAttribute("aria-label", "맨 위로 가기");

  // 버튼을 문서에 추가
  document.body.appendChild(scrollToTopBtn);

  // 클릭 이벤트 - 부드러운 스크롤로 맨 위로 이동
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // 스크롤 위치에 따라 버튼 표시 또는 숨기기
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      scrollToTopBtn.style.transform = "scale(1)";
    } else {
      scrollToTopBtn.style.transform = "scale(0)";
    }
  });
}

/**
 * 반응형 이미지 지연 로딩 초기화
 */
function initLazyLoading() {
  if ("loading" in HTMLImageElement.prototype) {
    // 브라우저가 네이티브 지연 로딩 지원
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // 폴백 솔루션 - Intersection Observer API 사용
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      imgObserver.observe(img);
    });
  }
}

/**
 * 페이지 진입 애니메이션 초기화
 */
function initPageEntranceAnimation() {
  // 페이지 로드 완료 후 애니메이션 효과
  document.body.classList.add("page-loaded");

  // 약간의 지연 후 시퀀스 애니메이션 시작
  setTimeout(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }

    const heroContent = document.querySelector("#hero .container");
    if (heroContent) {
      setTimeout(() => {
        heroContent.style.opacity = "1";
        heroContent.style.transform = "translateY(0)";
      }, 200);
    }
  }, 100);
}

/**
 * 요소에 애니메이션 클래스 추가
 * @param {Element} element - 애니메이션을 추가할 요소
 * @param {string} animationClass - 추가할 애니메이션 클래스 이름
 * @param {number} delay - 지연 시간(밀리초)
 */
function addAnimation(element, animationClass, delay = 0) {
  if (!element) return;

  setTimeout(() => {
    element.classList.add(animationClass);

    // 애니메이션 종료 후 클래스 제거
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(animationClass);
      },
      { once: true }
    );
  }, delay);
}

/**
 * 요소가 화면에 있는지 확인
 * @param {Element} element - 확인할 요소
 * @returns {boolean} - 요소가 화면에 있는지 여부
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
}

/**
 * 다국어 기능 초기화
 */
function initMultiLanguage() {
  // i18n.js가 로드되었는지 확인
  if (typeof i18n !== "undefined") {
    // 먼저 강화된 초기화 함수 사용
    if (typeof enhancedInitializeLanguage === "function") {
      enhancedInitializeLanguage();
    } else if (typeof initializeLanguage === "function") {
      // 호환성 처리, 강화된 함수가 없으면 기본 방식 사용
      initializeLanguage();
    } else {
      console.warn("다국어 초기화 함수 사용 불가, 기본 초기화 사용");
      // 기본 초기화 - i18n.js가 정확하게 로드되지 않을 때 기본 기능 제공
      try {
        const currentLang =
          localStorage.getItem("preferred-language") ||
          (navigator.language && navigator.language.startsWith("ko")
            ? "ko"
            : "en");
        document.documentElement.setAttribute("lang", currentLang);
      } catch (e) {
        console.error("기본 언어 초기화 실패:", e);
      }
    }

    // 언어 전환 추가 사용자 정의 이벤트 추가
    try {
      document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const lang = this.getAttribute("data-lang");

          // 먼저 강화된 언어 전환 함수 사용
          if (typeof enhancedSetLanguage === "function") {
            enhancedSetLanguage(lang);
          } else if (typeof setLanguageWithAnimation === "function") {
            // 다음으로 멋진 애니메이션 효과가 있는 언어 전환
            setLanguageWithAnimation(lang);
          } else if (typeof setLanguage === "function") {
            // 호환성 처리, 기본 언어 전환 함수 사용
            setLanguage(lang);
          } else {
            console.warn("언어 전환 함수 사용 불가");
            // 최소한의 처리 - HTML lang 속성 업데이트 및 선호도 저장
            try {
              localStorage.setItem("preferred-language", lang);
              document.documentElement.setAttribute("lang", lang);
            } catch (e) {
              console.error("기본 언어 전환 실패:", e);
            }
          }
        });
      });
    } catch (e) {
      console.error("언어 버튼에 이벤트 리스너 추가 중 오류:", e);
    }

    // 초기화 시 일괄 번역 수행, 성능 최적화
    if (typeof batchApplyTranslations === "function") {
      batchApplyTranslations();
    }
  } else {
    console.warn("i18n.js가 로드되지 않았습니다. 완전한 다국어 기능 사용 불가");
    // 기본적인 다국어 지원 시도
    try {
      const basicLanguageSupport = function () {
        const langBtns = document.querySelectorAll(".lang-btn");
        if (langBtns.length === 0) return;

        langBtns.forEach((btn) => {
          btn.addEventListener("click", function () {
            const lang = this.getAttribute("data-lang");
            try {
              localStorage.setItem("preferred-language", lang);
              document.documentElement.setAttribute("lang", lang);

              // 버튼 상태 업데이트
              langBtns.forEach((b) => {
                if (b.getAttribute("data-lang") === lang) {
                  b.classList.add("active");
                } else {
                  b.classList.remove("active");
                }
              });
            } catch (e) {
              console.error("기본 언어 전환 실패:", e);
            }
          });
        });

        // 초기화 버튼 상태
        try {
          const savedLang =
            localStorage.getItem("preferred-language") ||
            (navigator.language && navigator.language.startsWith("ko")
              ? "ko"
              : "en");

          langBtns.forEach((btn) => {
            if (btn.getAttribute("data-lang") === savedLang) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });

          document.documentElement.setAttribute("lang", savedLang);
        } catch (e) {
          console.error("초기화 언어 버튼 상태 실패:", e);
        }
      };

      basicLanguageSupport();
    } catch (e) {
      console.error("기본 다국어 지원 초기화 실패:", e);
    }
  }

  // 언어 전환 이벤트 수신
  try {
    document.addEventListener("languageChanged", function (event) {
      const lang = event.detail.language;
      console.log("Language changed to:", lang);

      // translateText 함수를 사용하여 특수 요소 업데이트
      const updateSpecialElements = function () {
        // 안전하게 번역 함수 가져오기
        const getTranslation = (key, defaultText) => {
          if (typeof safeTranslate === "function") {
            return safeTranslate(key, defaultText);
          } else if (typeof translateText === "function") {
            return translateText(key, defaultText);
          } else {
            return lang === "en" ? defaultText.en : defaultText.ko;
          }
        };

        try {
          // 복사 버튼 텍스트 업데이트
          const copyBtns = document.querySelectorAll(".copy-cmd-btn");
          const copyText = getTranslation("common.copy", {
            en: "Copy",
            ko: "복사",
          });

          copyBtns.forEach((btn) => {
            // 아직 "복사됨"이 표시되지 않은 버튼만 업데이트
            if (
              btn.textContent !== "Copied!" &&
              btn.textContent !== "복사됨!"
            ) {
              btn.textContent = copyText;
            }
          });
        } catch (e) {
          console.warn("복사 버튼 텍스트 업데이트 실패:", e);
        }

        try {
          // 모달 창의 닫기 버튼 텍스트 업데이트
          const closeModalBtn = document.getElementById("close-modal-btn");
          if (closeModalBtn) {
            closeModalBtn.textContent = getTranslation("common.close", {
              en: "Close",
              ko: "닫기",
            });
          }
        } catch (e) {
          console.warn("닫기 버튼 텍스트 업데이트 실패:", e);
        }
      };

      // setTimeout을 사용하여 UI 블로킹 방지
      setTimeout(updateSpecialElements, 0);

      // 현재 언어에 따라 작업 흐름 모달 내용 업데이트
      try {
        updateWorkflowModalContent(lang);
      } catch (e) {
        console.warn("작업 흐름 모달 내용 업데이트 실패:", e);
      }
    });
  } catch (e) {
    console.error("언어 변경 이벤트 수신자 추가 실패:", e);
  }
}

/**
 * 현재 언어에 따라 작업 흐름 모달 창 내용 업데이트
 * @param {string} lang - 현재 언어 코드 ("en" 또는 "ko")
 */
function updateWorkflowModalContent(lang) {
  const modal = document.getElementById("workflow-detail-modal");
  if (!modal) return;

  // 현재 표시되는 단계 가져오기
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  const currentStep = modal.getAttribute("data-current-step");

  if (currentStep && modalTitle && modalContent) {
    // 작업 흐름 상세 데이터에서 해당 언어의 내용 가져오기
    const workflowDetails = getWorkflowDetails();
    const langKey = lang === "en" ? "en" : "ko";

    if (workflowDetails[langKey] && workflowDetails[langKey][currentStep]) {
      const stepData = workflowDetails[langKey][currentStep];

      // requestAnimationFrame을 사용하여 렌더링 성능 최적화
      requestAnimationFrame(function () {
        modalTitle.textContent = stepData.title;
        modalContent.innerHTML = stepData.content;

        // 동적으로 생성된 내용에 data-i18n 속성 추가
        const dynamicElements = modalContent.querySelectorAll("h4, p, li");
        dynamicElements.forEach(function (el, index) {
          const key = `workflow.step${currentStep}.content.${index}`;
          el.setAttribute("data-i18n-dynamic", key);
        });
      });
    }
  }
}

/**
 * 작업 흐름 상세 데이터 가져오기
 * @returns {Object} 작업 흐름 상세 객체
 */
function getWorkflowDetails() {
  // 작업 흐름 상세 데이터 반환
  return {
    // 기존 데이터 유지
    en: {
      1: {
        title: "Task Planning",
        content: `
          <p>The task planning stage is the initial phase where AI assistants define project scope, set goals, and establish success criteria.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Clarify project requirements and constraints</li>
            <li>Set clear objectives and define measurable success criteria</li>
            <li>Establish project boundaries and identify stakeholders</li>
            <li>Create a high-level plan with timeline estimates</li>
            <li>Optionally reference existing tasks for continuous planning</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Comprehensive task description</li>
            <li>Clear success criteria</li>
            <li>Technical requirements and constraints</li>
          </ul>
          <p class="mt-4">This stage lays the foundation for all subsequent work, ensuring that both the AI assistant and the user have a shared understanding of what needs to be accomplished.</p>
        `,
      },
      2: {
        title: "In-depth Analysis",
        content: `
          <p>The in-depth analysis stage involves a thorough examination of the requirements and technical landscape to develop a viable implementation strategy.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Analyze requirements and identify technical challenges</li>
            <li>Evaluate technical feasibility and potential risks</li>
            <li>Research best practices and available solutions</li>
            <li>Systematically review existing codebase if applicable</li>
            <li>Develop initial implementation concepts</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Technical feasibility assessment</li>
            <li>Risk identification and mitigation strategies</li>
            <li>Initial implementation approach</li>
            <li>Pseudocode or architectural diagrams where appropriate</li>
          </ul>
          <p class="mt-4">This stage ensures that the proposed solution is technically sound and addresses all requirements before proceeding to implementation.</p>
        `,
      },
      3: {
        title: "Solution Reflection",
        content: `
          <p>The solution reflection stage involves critical review and optimization of the proposed approach before implementation.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Critically review the analysis results and proposed solutions</li>
            <li>Identify potential gaps, edge cases, or inefficiencies</li>
            <li>Consider alternative approaches and their trade-offs</li>
            <li>Evaluate solution against best practices and design principles</li>
            <li>Refine implementation strategy based on insights</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Optimized solution design</li>
            <li>Documented considerations and trade-offs</li>
            <li>Refined implementation strategy</li>
          </ul>
          <p class="mt-4">This reflective process helps catch potential issues early and ensures the chosen approach is optimal before investing in implementation.</p>
        `,
      },
      4: {
        title: "Task Decomposition",
        content: `
          <p>The task decomposition stage breaks down complex tasks into manageable, atomic subtasks with clear dependencies and execution order.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Break down complex tasks into smaller, manageable units</li>
            <li>Establish clear dependencies between subtasks</li>
            <li>Define scope and acceptance criteria for each subtask</li>
            <li>Assign priority levels and estimate complexity</li>
            <li>Create a logical execution sequence</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Supported Update Modes:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Append:</strong> Keep all existing tasks and add new ones</li>
            <li><strong>Overwrite:</strong> Clear all uncompleted tasks and completely replace them, while preserving completed tasks</li>
            <li><strong>Selective:</strong> Intelligently update existing tasks based on task names, preserving tasks not in the list</li>
            <li><strong>Clear All Tasks:</strong> Remove all tasks and create a backup</li>
          </ul>
          <p class="mt-4">This structured approach makes complex projects manageable by creating a clear roadmap of small, achievable steps.</p>
        `,
      },
      5: {
        title: "Task Execution",
        content: `
          <p>The task execution stage involves implementing specific tasks according to the predetermined plan, with a focus on quality and adherence to requirements.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Select tasks for execution based on dependencies and priorities</li>
            <li>Implement solutions following the implementation guide</li>
            <li>Follow coding standards and best practices</li>
            <li>Handle edge cases and error conditions</li>
            <li>Document implementation decisions and rationale</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Execution Process:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Prepare necessary resources and environment</li>
            <li>Follow the implementation guide step by step</li>
            <li>Monitor progress and handle any unexpected issues</li>
            <li>Maintain code quality and documentation</li>
          </ul>
          <p class="mt-4">This stage transforms plans into concrete results, implementing the solutions designed in earlier stages.</p>
        `,
      },
      6: {
        title: "Result Verification",
        content: `
          <p>The result verification stage ensures that implemented tasks meet all requirements and quality standards before being marked as complete.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Verify that all requirements have been implemented</li>
            <li>Check for adherence to technical standards and best practices</li>
            <li>Test edge cases and error handling</li>
            <li>Review code quality and documentation</li>
            <li>Validate against the verification criteria defined for the task</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Verification Checklist:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Functional correctness: Does it work as expected?</li>
            <li>Completeness: Are all requirements addressed?</li>
            <li>Quality: Does it meet coding standards and best practices?</li>
            <li>Performance: Does it operate efficiently?</li>
            <li>Documentation: Is the implementation well-documented?</li>
          </ul>
          <p class="mt-4">This thorough verification process ensures high-quality deliverables that fully satisfy requirements.</p>
        `,
      },
      7: {
        title: "Task Completion",
        content: `
          <p>The task completion stage formally marks tasks as complete, generates detailed completion reports, and updates the status of dependent tasks.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Formally mark task as completed after successful verification</li>
            <li>Generate a comprehensive completion report</li>
            <li>Update the status of dependent tasks</li>
            <li>Archive relevant information for future reference</li>
            <li>Communicate completion to stakeholders</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Completion Report Contents:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Summary of completed work</li>
            <li>Implementation highlights and key decisions</li>
            <li>Any notable challenges encountered and their solutions</li>
            <li>Recommendations for future work or improvements</li>
          </ul>
          <p class="mt-4">The completion stage ensures proper closure of tasks, maintains workflow continuity, and builds institutional knowledge for future projects.</p>
        `,
      },
    },
    "ko": {
      1: {
        title: "작업 계획",
        content: `
          <p>작업 계획 단계는 AI 조수가 프로젝트 범위를 정의하고, 목표를 설정하며, 성공 기준을 수립하는 초기 단계입니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>프로젝트 요구사항 및 제약 조건 명확화</li>
            <li>명확한 목표 설정 및 측정 가능한 성공 기준 정의</li>
            <li>프로젝트 범위 설정 및 이해관계자 식별</li>
            <li>타임라인 추정치를 포함한 상위 수준 계획 수립</li>
            <li>지속적인 계획을 위해 기존 작업 참조(선택 사항)</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">산출물:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>포괄적인 작업 설명</li>
            <li>명확한 성공 기준</li>
            <li>기술적 요구사항 및 제약 조건</li>
          </ul>
          <p class="mt-4">이 단계는 모든 후속 작업의 기초를 마련하여 AI 조수와 사용자 모두가 달성해야 할 목표에 대해 공통된 이해를 갖도록 보장합니다.</p>
        `,
      },
      2: {
        title: "심층 분석",
        content: `
          <p>심층 분석 단계에서는 실행 가능한 구현 전략을 개발하기 위해 요구사항과 기술 환경을 철저히 검토합니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>요구사항 분석 및 기술적 과제 식별</li>
            <li>기술적 타당성 및 잠재적 위험 평가</li>
            <li>모범 사례 및 사용 가능한 솔루션 연구</li>
            <li>해당하는 경우 기존 코드베이스를 체계적으로 검토</li>
            <li>초기 구현 개념 개발</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">산출물:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>기술적 타당성 평가</li>
            <li>위험 식별 및 완화 전략</li>
            <li>초기 구현 접근 방식</li>
            <li>적절한 경우 의사 코드 또는 아키텍처 다이어그램</li>
          </ul>
          <p class="mt-4">이 단계는 제안된 솔루션이 기술적으로 타당하고 구현을 진행하기 전에 모든 요구사항을 해결하는지 확인합니다.</p>
        `,
      },
      3: {
        title: "솔루션 성찰",
        content: `
          <p>솔루션 성찰 단계에서는 구현 전에 제안된 접근 방식을 비판적으로 검토하고 최적화합니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>분석 결과 및 제안된 솔루션을 비판적으로 검토</li>
            <li>잠재적인 격차, 예외 사례 또는 비효율성 식별</li>
            <li>대체 접근 방식 및 장단점 고려</li>
            <li>모범 사례 및 설계 원칙에 따라 솔루션 평가</li>
            <li>통찰력을 바탕으로 구현 전략 구체화</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">산출물:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>최적화된 솔루션 설계</li>
            <li>고려 사항 및 장단점 문서화</li>
            <li>구체화된 구현 전략</li>
          </ul>
          <p class="mt-4">이 성찰 과정은 잠재적인 문제를 조기에 발견하고 구현에 투자하기 전에 선택한 접근 방식이 최적인지 확인하는 데 도움이 됩니다.</p>
        `,
      },
      4: {
        title: "작업 분해",
        content: `
          <p>작업 분해 단계는 복잡한 작업을 관리 가능하고 원자적인 하위 작업으로 나누고 명확한 종속성 및 실행 순서를 설정합니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>복잡한 작업을 더 작고 관리 가능한 단위로 분해</li>
            <li>하위 작업 간의 명확한 종속성 설정</li>
            <li>각 하위 작업의 범위 및 수용 기준 정의</li>
            <li>우선순위 수준 할당 및 복잡성 추정</li>
            <li>논리적 실행 순서 생성</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">지원되는 업데이트 모드:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>추가(append):</strong> 기존 모든 작업을 유지하고 새 작업을 추가합니다.</li>
            <li><strong>덮어쓰기(overwrite):</strong> 완료되지 않은 모든 작업을 지우고 완료된 작업을 유지하면서 완전히 교체합니다.</li>
            <li><strong>선택적 업데이트(selective):</strong> 작업 이름을 기반으로 기존 작업을 지능적으로 업데이트하고 목록에 없는 작업은 유지합니다.</li>
            <li><strong>모든 작업 지우기(clearAllTasks):</strong> 모든 작업을 제거하고 백업을 생성합니다.</li>
          </ul>
          <p class="mt-4">이 구조화된 접근 방식은 작고 달성 가능한 단계의 명확한 로드맵을 만들어 복잡한 프로젝트를 관리 가능하게 만듭니다.</p>
        `,
      },
      5: {
        title: "작업 실행",
        content: `
          <p>작업 실행 단계는 사전에 결정된 계획에 따라 특정 작업을 구현하며, 품질 및 요구사항 준수에 중점을 둡니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>종속성 및 우선순위에 따라 실행할 작업 선택</li>
            <li>구현 가이드에 따라 솔루션 구현</li>
            <li>코딩 표준 및 모범 사례 준수</li>
            <li>예외 사례 및 오류 조건 처리</li>
            <li>구현 결정 및 근거 문서화</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">실행 프로세스:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>필요한 리소스 및 환경 준비</li>
            <li>구현 가이드를 단계별로 따름</li>
            <li>진행 상황 모니터링 및 예기치 않은 문제 처리</li>
            <li>코드 품질 및 문서 유지</li>
          </ul>
          <p class="mt-4">이 단계는 계획을 구체적인 결과로 전환하여 이전 단계에서 설계된 솔루션을 구현합니다.</p>
        `,
      },
      6: {
        title: "결과 검증",
        content: `
          <p>결과 검증 단계는 구현된 작업이 완료로 표시되기 전에 모든 요구사항과 품질 표준을 충족하는지 확인합니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>모든 요구사항이 구현되었는지 확인</li>
            <li>기술 표준 및 모범 사례 준수 여부 확인</li>
            <li>예외 사례 및 오류 처리 테스트</li>
            <li>코드 품질 및 문서 검토</li>
            <li>작업에 대해 정의된 검증 기준에 따라 검증</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">검증 체크리스트:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>기능적 정확성: 예상대로 작동하는가?</li>
            <li>완전성: 모든 요구사항이 해결되었는가?</li>
            <li>품질: 코딩 표준 및 모범 사례를 충족하는가?</li>
            <li>성능: 효율적으로 작동하는가?</li>
            <li>문서: 구현이 잘 문서화되었는가?</li>
          </ul>
          <p class="mt-4">이 철저한 검증 과정은 요구사항을 완전히 충족하는 고품질 결과물을 보장합니다.</p>
        `,
      },
      7: {
        title: "작업 완료",
        content: `
          <p>작업 완료 단계는 작업을 공식적으로 완료로 표시하고, 상세한 완료 보고서를 생성하며, 종속 작업의 상태를 업데이트합니다.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">주요 활동:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>성공적인 검증 후 작업을 공식적으로 완료로 표시</li>
            <li>포괄적인 완료 보고서 생성</li>
            <li>종속 작업의 상태 업데이트</li>
            <li>향후 참조를 위해 관련 정보 보관</li>
            <li>이해관계자에게 완료 사실 전달</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">완료 보고서 내용:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>완료된 작업 요약</li>
            <li>구현 하이라이트 및 주요 결정</li>
            <li>발생한 주목할 만한 과제 및 해결책</li>
            <li>향후 작업 또는 개선을 위한 권장 사항</li>
          </ul>
          <p class="mt-4">완료 단계는 작업의 적절한 마무리를 보장하고, 워크플로우 연속성을 유지하며, 향후 프로젝트를 위한 조직적 지식을 구축합니다.</p>
        `,
      },
    },
  };
}

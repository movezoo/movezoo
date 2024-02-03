// 프로덕션 환경에서는 로컬 캐시에서 자산을 제공하기 위해 서비스 워커를 등록합니다.

// 이렇게 함으로써 앱은 프로덕션에서 재방문 시 더 빠르게 로드되며 오프라인 기능을 제공합니다.
// 그러나 이것은 개발자(및 사용자)가 배포된 업데이트를 "N+1" 페이지 방문에서만 볼 수 있다는 의미이기도 합니다.
// 이 모델의 이점에 대해 자세히 알아보려면 https://goo.gl/KwvDNy를 읽어보세요.
// 이 링크에는 이 동작에서 벗어나는 방법에 대한 지침도 포함되어 있습니다.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1]은 IPv6 로컬호스트 주소입니다.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8은 IPv4에서 로컬호스트로 간주됩니다.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // URL 생성자는 SW를 지원하는 모든 브라우저에서 사용 가능합니다.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      // PUBLIC_URL이 페이지가 제공되는 origin과 다른 경우 서비스 워커가 작동하지 않습니다.
      // 이것은 자산을 제공하기 위해 CDN이 사용되는 경우 발생할 수 있습니다;
      // 자세한 내용은 https://github.com/facebookincubator/create-react-app/issues/2374를 참조하세요.
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // 이것은 localhost에서 실행 중입니다. 서비스 워커가 여전히 존재하는지 확인합시다.
        checkValidServiceWorker(swUrl);

        // localhost에 추가 로깅을 추가하고 개발자를 서비스 워커/PWA 문서로 안내합니다.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            '이 웹 앱은 서비스 워커에 의해 캐시 우선으로 제공되고 있습니다. ' +
              '자세한 내용은 https://goo.gl/SC7cgQ를 방문하세요.'
          );
        });
      } else {
        // localhost가 아닙니다. 서비스 워커를 등록하세요.
        registerValidSW(swUrl);
      }
    });
  }
}

// 유효한 서비스 워커 등록 함수
function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 이 시점에서 이전 콘텐츠가 삭제되고
              // 새로운 콘텐츠가 캐시에 추가되었습니다.
              // "새로운 콘텐츠가 사용 가능합니다. 새로고침해주세요." 메시지를 표시하기에 완벽한 시점입니다.
              console.log('새로운 콘텐츠가 사용 가능합니다. 새로고침해주세요.');
            } else {
              // 이 시점에서 모든 것이 미리 캐시되었습니다.
              // "콘텐츠가 오프라인 사용을 위해 캐시되었습니다." 메시지를 표시하기에 완벽한 시점입니다.
              console.log('콘텐츠가 오프라인 사용을 위해 캐시되었습니다.');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('서비스 워커 등록 중 오류 발생:', error);
    });
}

// 유효한 서비스 워커 확인 함수
function checkValidServiceWorker(swUrl) {
  // 서비스 워커를 찾을 수 있는지 확인합니다. 찾을 수 없으면 페이지를 다시로드합니다.
  fetch(swUrl)
    .then(response => {
      // 서비스 워커가 존재하고 실제로 JS 파일을 받고 있는지 확인합니다.
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // 서비스 워커를 찾을 수 없습니다. 아마도 다른 앱입니다. 페이지를 다시로드합니다.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // 서비스 워커를 찾았습니다. 정상적으로 계속 진행합니다.
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log('인터넷 연결 없음. 앱이 오프라인 모드에서 실행 중입니다.');
    });
}

// 서비스 워커 등록 해제 함수
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
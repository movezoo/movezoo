package io.openvidu.basic.java;

import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;

@CrossOrigin(origins = "*")
@RestController
public class Controller {

	@Value("${OPENVIDU_URL}")
	private String OPENVIDU_URL;

	@Value("${OPENVIDU_SECRET}")
	private String OPENVIDU_SECRET;

	private OpenVidu openvidu;

	@PostConstruct
	public void init() {
		// OPENVIDU_URL 및 OPENVIDU_SECRET으로 OpenVidu 인스턴스를 초기화합니다.
		this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
	}

	/**
	 * 주어진 속성으로 새로운 OpenVidu 세션을 초기화합니다.
	 * 
	 * @param params 세션 속성을 나타내는 맵
	 * @return 생성된 세션의 ID
	 * @throws OpenViduJavaClientException OpenVidu Java 클라이언트 예외
	 * @throws OpenViduHttpException       OpenVidu HTTP 예외
	 */
	@PostMapping("/api/openvidu/sessions")
	public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
			throws OpenViduJavaClientException, OpenViduHttpException {
		// 전달된 JSON 매개변수를 사용하여 SessionProperties를 빌드하고, 해당 속성을 사용하여 새 세션을 생성합니다.
		SessionProperties properties = SessionProperties.fromJson(params).build();
		Session session = openvidu.createSession(properties);
		return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
	}

	/**
	 * 기존 OpenVidu 세션 내에서 새로운 연결을 생성합니다.
	 * 
	 * @param sessionId 세션 내에서 연결을 생성할 세션 ID
	 * @param params    연결 속성을 나타내는 맵
	 * @return 생성된 연결에 대한 토큰
	 * @throws OpenViduJavaClientException OpenVidu Java 클라이언트 예외
	 * @throws OpenViduHttpException       OpenVidu HTTP 예외
	 */
	@PostMapping("/api/openvidu/sessions/{sessionId}/connections")
	public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
			@RequestBody(required = false) Map<String, Object> params)
			throws OpenViduJavaClientException, OpenViduHttpException {
		// 제공된 sessionId로 활성 세션을 검색합니다.
		Session session = openvidu.getActiveSession(sessionId);
		if (session == null) {
			// 세션이 찾아지지 않으면 404 상태 코드를 반환합니다.
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		// 전달된 JSON 매개변수를 사용하여 ConnectionProperties를 빌드하고, 해당 속성을 사용하여 새 연결을 생성합니다.
		ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
		Connection connection = session.createConnection(properties);

		// 생성된 연결에 대한 토큰과 200 상태 코드를 반환합니다.
		return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
	}
}

# Cafe24 스택 API·라이브러리 변경 목록

> **대상 경로:** `F:\cama_pjt\cama-cafe24`  
> **원본(Gabia):** `F:\cama_pjt\nicecog\cama-billive` (Spring Boot 2.3~2.5, JDK 11/17, PG 11)  
> **Cafe24 목표:** Spring Boot **3.5**, JDK **21**(런타임) / 빌드 **17+**, PostgreSQL **17**

---

## 1. 빌드·플랫폼

| 항목 | Gabia (원본) | Cafe24 (본 디렉터리) |
|------|--------------|----------------------|
| Spring Boot | 2.5.15 / 2.3.4 | **3.5.0** |
| Java (compile) | 17 / 11 | **21** (Eclipse Temurin 21.0.11, class major 65) |
| PostgreSQL dialect | PostgreSQL10Dialect | **PostgreSQLDialect** (Hibernate 6) |
| MyBatis starter | 2.2.2 | **3.0.4** |

---

## 2. 교체·제거한 API (기능 동등)

### 2.1 Jakarta EE (`javax.*` → `jakarta.*`)

| 구분 | 이전 | 이후 |
|------|------|------|
| JPA | `javax.persistence.*` | `jakarta.persistence.*` |
| Servlet | `javax.servlet.*` | `jakarta.servlet.*` |
| Annotation | `javax.annotation.*` | `jakarta.annotation.*` |
| Validation | `javax.validation.*` | `jakarta.validation.*` |

**유지:** `javax.crypto.*` (JDK 표준, 변경 없음)

### 2.2 Spring Security 6

| 이전 | 이후 |
|------|------|
| `WebSecurityConfigurerAdapter` | `SecurityFilterChain` `@Bean` |
| `authorizeRequests()` / `antMatchers()` | `authorizeHttpRequests()` / `requestMatchers()` |
| `AuthenticationManager` `@Bean` override | `AuthenticationConfiguration#getAuthenticationManager()` |
| `WebSecurity#ignoring()` | `WebSecurityCustomizer` |

**동작:** JWT 필터·permitAll 경로·역할 기반 접근 — **동일 URL 정책 유지**

### 2.3 OpenAPI 문서 (Swagger)

| 이전 | 이후 | 비고 |
|------|------|------|
| Springfox 2.9 (`@EnableSwagger2`, `Docket`) | **springdoc-openapi 2.8** | Spring Boot 3 전용 |
| `@ApiOperation` | `@Operation(summary=...)` | |
| `@ApiModelProperty` | `@Schema(description=..., requiredMode=...)` | |
| `@Api` | `@Tag(name=...)` | |
| `@ApiIgnore` | `@Hidden` | |
| UI | `/swagger-ui.html` | springdoc 기본 경로 동일 |

**프로필:** `local`, `local-cafe24` 에서만 OpenAPI 노출

### 2.4 Hibernate JSONB (`jsonb` 컬럼)

| 이전 | 이후 |
|------|------|
| `hibernate-types-52` + `@TypeDef` + `@Type(type="jsonb")` | `@JdbcTypeCode(SqlTypes.JSON)` (Hibernate 6 내장) |
| `com.vladmihalcea.hibernate.type.json.JsonBinaryType` | **제거** |

**영향 엔티티:** `TrackService`, `AccountSchedule`, `CmContents`, `CoachingExerciseSurveyResultHst`, batch `TrackService` 등

### 2.5 Base64 (JAXB 제거)

| 이전 | 이후 |
|------|------|
| `javax.xml.bind.DatatypeConverter.parseBase64Binary` | `java.util.Base64.getDecoder().decode` |

**파일:** `CommonImageUploadRestController.java`

### 2.6 HTTP Client (서버, 선택)

| 이전 | 이후 |
|------|------|
| `org.apache.httpcomponents:httpclient` 4.x | `httpclient5` (Spring Boot 3 BOM) |

*직접 HttpClient 4 API 사용 코드가 있으면 추가 점검 필요.*

### 2.7 BouncyCastle

| 이전 | 이후 |
|------|------|
| `bcpkix-jdk15on` | `bcpkix-jdk18on` |

### 2.8 Firebase Admin SDK

| 이전 | 이후 |
|------|------|
| 9.1.0 / 9.2.0 | **9.4.3** |

**FCM:** HTTP v1 / Admin SDK — **호출 방식 변경 없음** (카페24 가상서버 FCM 443 확인됨)

### 2.9 JWT (Auth0 java-jwt)

| 이전 | 이후 |
|------|------|
| 4.0.0 | **4.4.0** |

**jjwt** (일부 코드): 0.11.5 → **0.12.6** — API 호환 유지

### 2.10 MySQL 커넥터 (서버)

| 이전 | 이후 |
|------|------|
| `mysql-connector-java` (Boot 2) | **제거** (Cafe24 PG 전용; Gabia mysql 프로필 파일만 유지) |

---

## 3. 프로필·설정 파일

| Gabia | Cafe24 |
|-------|--------|
| `application-local-gabia.yml` | **`application-local-cafe24.yml`** |
| `application-gabia.yml` | **`application-cafe24.yml`** (신규) |
| `local-gabia` profile | **`local-cafe24`** |
| `BatchDevController` `@Profile("local-gabia")` | `@Profile("local-cafe24")` |

---

## 4. 미적용·보류 (앱/RN)

| 항목 | 사유 |
|------|------|
| `cama-plus-app` | API URL만 운영 시 변경; 본 repo 미포함 |
| Gabia 소스 (`nicecog/cama-billive`) | **수정 없음** — 분리 유지 |

---

## 5. 로컬 검증 상태 (2026-06-01)

| 검증 | 결과 |
|------|------|
| `mvn clean test package` (server, batch) | **PASS** (JDK 21, 2026-06-01) |
| class file major version | **65** (Java 21) |
| Docker PG + 런타임 smoke | **미실행** — Docker Desktop 미기동 |
| FCM 실제 전송 | Firebase JSON·DB 토큰 필요 |

**로컬 실행 순서:**

```powershell
cd F:\cama_pjt\cama-cafe24
docker compose -f docker-compose.local.yml up -d

cd cama-plus-server
.\scripts\run-local-cafe24.ps1

cd ..\cama-back-batch
.\scripts\run-local-cafe24.ps1
.\scripts\smoke-test-batch-local.ps1
```

---

## 6. Cafe24 VPS 배포 시 추가 작업

- [ ] JDK **21** 설치 (`release 21` 빌드 시 pom `java.version` 21)
- [ ] PostgreSQL **17** + 스키마/데이터 이관
- [ ] `application-cafe24` + 환경 변수 (`DB_*`, `JWT_*`, `FIREBASE_CREDENTIALS_PATH`)
- [ ] systemd: API 8080, batch 8082
- [ ] `curl -v https://fcm.googleapis.com` (카페24 권장)

---

## 7. 알려진 제한·후속

1. **JDK 21:** `Eclipse Temurin 21.0.11` (`C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`). Microsoft OpenJDK 21 winget은 1603으로 실패, Temurin으로 설치함.
2. **Spring Boot 3.5 + 일부 레거시:** `ConnectionBasedVoter`는 Spring Security 6에서 `FilterInvocation` deprecated — 현재 SecurityConfig에서 **미사용**(제거됨).
3. **경고 0 목표:** `mvn -DcompilerArgument=-Xlint:all` 추가 점검 권장.
4. **통합 테스트:** Docker PG 기동 후 API auth·track·FCM dry-run 수동/스크립트 재실행 필요.

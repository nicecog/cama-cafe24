package com.cama.back.config;

import com.cama.back.security.*;
import com.cama.back.service.account.AccountService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsUtils;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAccessDeniedHandler accessDeniedHandler;
    private final EntryPointUnauthorizedHandler unauthorizedHandler;

    public SecurityConfig(JwtAccessDeniedHandler accessDeniedHandler,
                          EntryPointUnauthorizedHandler unauthorizedHandler) {
        this.accessDeniedHandler = accessDeniedHandler;
        this.unauthorizedHandler = unauthorizedHandler;
    }

    @Bean
    public JwtAuthenticationProvider jwtAuthenticationProvider(JWT jwt, AccountService accountService) {
        return new JwtAuthenticationProvider(jwt, accountService);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter() {
        return new JwtAuthenticationTokenFilter();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                .requestMatchers("/api/account/patient/recover/**")
                .requestMatchers("/api/public/patient/recover/**")
                .requestMatchers("/api/account/patient/find/**")
                .requestMatchers(HttpMethod.POST, "/api/account/find/id")
                .requestMatchers(HttpMethod.POST, "/api/account/find/id/check");
    }

    /** recover/find 계정 API — 메인 체인의 /api/account/** USER 규칙보다 먼저 공개 처리 */
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain patientRecoverSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher(
                        "/api/account/patient/recover/**",
                        "/api/public/patient/recover/**",
                        "/api/account/patient/find/**",
                        "/api/account/find/id",
                        "/api/account/find/id/check")
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE + 1)
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtAuthenticationProvider jwtAuthenticationProvider,
                                                   JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter)
            throws Exception {
        http
                .authenticationProvider(jwtAuthenticationProvider)
                .httpBasic(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .accessDeniedHandler(accessDeniedHandler)
                        .authenticationEntryPoint(unauthorizedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/api/enums").permitAll()
                        .requestMatchers("/api/auth").permitAll()
                        .requestMatchers("/api/auth/doctor").permitAll()
                        .requestMatchers("/api/auth/sns").permitAll()
                        .requestMatchers("/api/auth/pass").permitAll()
                        .requestMatchers("/api/auth/admin").permitAll()
                        .requestMatchers("/api/auth/secure").permitAll()
                        .requestMatchers("/api/common/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/account/sns/check").permitAll()
                        .requestMatchers("/api/account/sign/check").permitAll()
                        .requestMatchers("/api/notice/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/account/iamport").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/account").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/account/find/id").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/account/find/id/check").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/account/pwd").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/account/check").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/account/merge").permitAll()
                        .requestMatchers("/api/contents/**").permitAll()
                        .requestMatchers("/api/coaching/**").permitAll()
                        .requestMatchers("/api/track/service/guest/progress").permitAll()
                        .requestMatchers("/api/webview/account/**").permitAll()
                        .requestMatchers("/api/webview/contents/**").permitAll()
                        .requestMatchers("/api/webview/track/**").permitAll()
                        .requestMatchers("/api/webview/coaching/**").permitAll()
                        .requestMatchers("/api/webview/hospital/**").permitAll()
                        .requestMatchers("/api/webview/schedule/**").permitAll()
                        .requestMatchers("/api/webview/notification/**").permitAll()
                        .requestMatchers("/api/webview/common/**").permitAll()
                        .requestMatchers("/api/account/general/**").permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/account/patient/find/login-id", "POST")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/account/patient/find/password", "POST")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/account/patient/recover/login-id", "POST")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/account/patient/recover/password", "POST")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/account/find/id", "POST")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/account/find/id/check", "POST")).permitAll()
                        .requestMatchers("/api/account/patient/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/files/**").permitAll()
                        .requestMatchers(HttpMethod.HEAD, "/files/**").permitAll()
                        .requestMatchers("/api/team/**").hasAnyRole("USER")
                        .requestMatchers("/api/firebase/**").hasAnyRole("USER")
                        .requestMatchers("/api/design/**").hasAnyRole("USER")
                        .requestMatchers("/api/account/**").hasAnyRole("USER", "OWNER")
                        .requestMatchers("/api/doctor/**").hasAnyRole("DOCTOR")
                        .requestMatchers("/api/monitoring/**").hasAnyRole("DOCTOR")
                        .requestMatchers("/api/admin/**").hasAnyRole("ADMIN")
                        .requestMatchers("/api/**").hasAnyRole("USER")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

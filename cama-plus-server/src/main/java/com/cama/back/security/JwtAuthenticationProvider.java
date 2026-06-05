package com.cama.back.security;

import com.cama.back.domain.account.Account;
import com.cama.back.domain.account.AccountRole;
import com.cama.back.domain.account.LoginType;
import com.cama.back.domain.account.SignType;
import com.cama.back.domain.admin.CmAdmin;
import com.cama.back.domain.doctor.CmDoctor;
import com.cama.back.exception.common.LoginAccessDeniedException;
import com.cama.back.exception.common.PasswordNotMatchingException;
import com.cama.back.service.account.AccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.apache.commons.lang3.ClassUtils.isAssignable;

public class JwtAuthenticationProvider implements AuthenticationProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationProvider.class);

    private final JWT jwt;

    private final AccountService accountService;

    public JwtAuthenticationProvider(JWT jwt, AccountService accountService) {
        this.jwt = jwt;
        this.accountService = accountService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        //System.out.println("Authentication Provider Start");

        JwtAuthenticationToken authenticationToken = (JwtAuthenticationToken) authentication;
        return processUserAuthentication(authenticationToken);
    }

    private Authentication processUserAuthentication(JwtAuthenticationToken jwtAuthenticationToken) {

        try {

            if (jwtAuthenticationToken.getLoginType().equals(LoginType.ADMIN)) {

                AuthenticationRequest request = jwtAuthenticationToken.authenticationRequest();
                CmAdmin admin = accountService.loginAdmin(request.getPrincipal(), request.getCredentials());
                JwtAuthenticationToken authenticated =
                        new JwtAuthenticationToken(admin.getSeq(), null, authorities(Set.of(AccountRole.ADMIN)));
                String apiToken = admin.apiToken(jwt, Stream.of(AccountRole.ADMIN).map(AccountRole::name).toArray(String[]::new));
                authenticated.setDetails(new AuthenticationAdminResult(apiToken, admin));
                return authenticated;

            } else if (jwtAuthenticationToken.getLoginType().equals(LoginType.DOCTOR)) {
                AuthenticationRequest request = jwtAuthenticationToken.authenticationRequest();
                CmDoctor doctor = accountService.loginDoctor(request.getPrincipal(), request.getCredentials());
                JwtAuthenticationToken authenticated =
                        new JwtAuthenticationToken(doctor.getSeq(), null, authorities(Set.of(AccountRole.DOCTOR)));
                String apiToken = doctor.apiToken(jwt, Stream.of(AccountRole.DOCTOR).map(AccountRole::name).toArray(String[]::new));
                authenticated.setDetails(new AuthenticationDoctorResult(apiToken, doctor));
                return authenticated;
            } else if (jwtAuthenticationToken.getLoginType().equals(LoginType.PASS)) {

                AuthenticationPassRequest request = jwtAuthenticationToken.authenticationPassRequest();

                Account account = accountService.loginPassApp(request.getImpUid());

                boolean isAdmin = account.getRoles().stream().anyMatch(x -> x.equals(AccountRole.ADMIN));
                if (!isAdmin) {
                    accountService.firebaseToken(account, request.getFirebase());
                }

                JwtAuthenticationToken authenticated =
                        new JwtAuthenticationToken(account.getSeq(), null, authorities(Set.of(AccountRole.USER)));
                String apiToken = account.newApiToken(jwt, Stream.of(AccountRole.USER).map(AccountRole::name).toArray(String[]::new));
                authenticated.setDetails(new AuthenticationResult(apiToken, account));
                return authenticated;

            } else {

                AuthenticationRequest request = jwtAuthenticationToken.authenticationRequest();
                Account account = accountService.login(request.getPrincipal(), request.getCredentials());

                if (jwtAuthenticationToken.isSns()) {
                    if (account.getSignType().equals(SignType.DEFAULT)) {
                        throw new LoginAccessDeniedException();
                    }
                } else {
                    if (!account.getSignType().equals(SignType.DEFAULT)
                            && !account.getSignType().equals(SignType.GENERAL)) {
                        throw new LoginAccessDeniedException();
                    }
                }

                Set<AccountRole> accountRoles = account.getRoles();
                if (accountRoles == null || accountRoles.isEmpty()) {
                    accountRoles = Set.of(AccountRole.USER);
                }

                boolean isAdmin = accountRoles.stream().anyMatch(x -> x.equals(AccountRole.ADMIN));
                if (!isAdmin) {
                    accountService.firebaseToken(account, request.getFirebase());
                }

                JwtAuthenticationToken authenticated =
                        new JwtAuthenticationToken(account.getSeq(), null, authorities(Set.of(AccountRole.USER)));
                String apiToken = account.newApiToken(
                        jwt, accountRoles.stream().map(AccountRole::name).toArray(String[]::new));
                authenticated.setDetails(new AuthenticationResult(apiToken, account));
                return authenticated;
            }


        } catch (UsernameNotFoundException e) {
            throw new BadCredentialsException("존재하지 않는 아이디입니다.");
        } catch (IllegalArgumentException e) {
            throw new BadCredentialsException(e.getMessage());
        } catch (PasswordNotMatchingException e) {
            throw new BadCredentialsException(
                    "비밀번호가 일치하지 않습니다. 비밀번호 찾기에서 임시 비밀번호를 다시 발급받을 수 있습니다.");
        } catch (LoginAccessDeniedException e) {
            throw new BadCredentialsException("이 로그인 방식으로 접속할 수 없는 계정입니다.");
        } catch (DataAccessException e) {
            throw new AuthenticationServiceException(e.getMessage(), e);
        } catch (RuntimeException e) {
            log.warn("Authentication failed [{}]: {}", e.getClass().getName(), e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return isAssignable(JwtAuthenticationToken.class, authentication);
    }

    private static Collection<? extends GrantedAuthority> authorities(Set<AccountRole> roles) {
        return roles.stream()
                .map(r -> new SimpleGrantedAuthority(r.name()))
                .collect(Collectors.toSet());
    }

}

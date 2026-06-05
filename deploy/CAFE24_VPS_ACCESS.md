# Cafe24 VPS 접속

**비밀번호·상세 접속 정보:** [`deploy/CAFE24_VPS_ACCESS.local.md`](CAFE24_VPS_ACCESS.local.md) (Git 제외, 로컬·에이전트용)

| 항목 | 값 |
|------|-----|
| 호스트 | `210.114.18.156` |
| 도메인 | `camaplus.cafe24.com` |
| SSH | `root@210.114.18.156` |

로컬 파일이 없으면 `deploy/CAFE24_VPS_ACCESS.local.md`를 이 문서 표를 참고해 생성하세요.

## react-app-dawplus VPS 반영

```powershell
python deploy/scripts/vps-deploy-react-app.py
```

가이드: [docs/CAFE24_REACT_APP_DEPLOY.md](../docs/CAFE24_REACT_APP_DEPLOY.md)

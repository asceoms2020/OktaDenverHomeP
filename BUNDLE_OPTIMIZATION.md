# 번들 크기 최적화 가이드

## 🎯 최적화 결과

### Before (최적화 전)
- Entrypoint: **1.93 MiB** ❌
- CSS-loader 파일: **1.69 MiB** ❌
- 경고: 3개의 성능 경고

### After (최적화 후)
- Entrypoint: **253 KiB** ✅
- CSS 별도 파일: **3.86 KiB** ✅
- 경고: **0개** ✅

## 🔧 적용된 최적화 기법

### 1. CSS 분리
```javascript
// CSS를 별도 파일로 추출
new MiniCssExtractPlugin({
  filename: 'styles/[name].[contenthash:8].css',
})
```

### 2. 라이브러리별 청크 분할
```javascript
cacheGroups: {
  react: { name: 'react-vendor' },
  mui: { name: 'mui-vendor' },
  emotion: { name: 'emotion-vendor' },
  styledComponents: { name: 'styled-vendor' },
  router: { name: 'router-vendor' }
}
```

### 3. 번들 크기 제한
```javascript
performance: {
  maxEntrypointSize: 500000, // 500KB
  maxAssetSize: 500000, // 500KB
}
```

## 📊 관리 명령어

### 번들 분석
```bash
npm run analyze  # 번들 구성 시각화
```

### 빌드 확인
```bash
npm run build    # 프로덕션 빌드
npm run dev      # 개발 서버
```

## ⚠️ 주의사항

1. **새 라이브러리 추가시**: 크기가 큰 경우 별도 청크 그룹 생성 고려
2. **이미지 최적화**: 4KB 이상 이미지는 별도 파일로 처리
3. **성능 모니터링**: 정기적으로 `npm run analyze` 실행

## 🚀 추가 최적화 방법

### Tree Shaking 개선
```javascript
// 사용하지 않는 코드 제거
import { Button } from '@mui/material'; // ✅ 좋음
import * as MUI from '@mui/material';   // ❌ 나쁨
```

### Lazy Loading
```javascript
// 페이지별 지연 로딩
const About = lazy(() => import('./pages/About'));
```

### Bundle Splitting
- 페이지별로 코드 분할
- 라우터 기반 청크 분할 고려 
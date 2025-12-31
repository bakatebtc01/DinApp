# DinApp APK Release Checklist

## Pre-Release (Do Once)

- [ ] Generate signing keystore: `scripts/generate-keystore.ps1`
- [ ] Backup keystore file to secure location (encrypted drive, password manager)
- [ ] Create Cloudflare account (free tier)
- [ ] Create R2 bucket named `dinapp-apk`
- [ ] Get Cloudflare API token with R2 permissions
- [ ] Add GitHub Secrets (CLOUDFLARE*ACCOUNT_ID, CLOUDFLARE_API_TOKEN, KEYSTORE*\*, etc.)
- [ ] Verify Android SDK installed locally (optional for local builds)

## Version Release Process

### 1. Update Version Numbers

```gradle
File: mobile/build.gradle
- versionCode: increment by 1
- versionName: update to semantic version (0.1 → 0.2)
```

### 2. Update Release Notes

```markdown
File: CHANGELOG.md

- List new features
- List bug fixes
- Note any breaking changes
```

### 3. Commit & Tag

```bash
git add .
git commit -m "Release v0.2"
git tag -a v0.2 -m "DinApp v0.2 - Beta release"
git push origin main --tags
```

### 4. Trigger Build

- GitHub Actions automatically builds on tag push
- Monitor Actions tab for build status
- Check APK file size (debug APK: ~80-120MB, release: ~40-60MB)

### 5. Verify APK

- Download from release artifacts
- Test on Android emulator or physical device
- Verify OTP login works
- Verify wallet creation
- Verify version number in Settings > About

### 6. Share with Users

- Publish download link: `https://dinapp-apk.pages.dev`
- Send to WhatsApp/Telegram groups
- Share GitHub release page
- Include SHA-256 checksum for security verification

## During Pilot Testing

- [ ] Monitor app crashes via error logs
- [ ] Collect user feedback via feedback form or WhatsApp
- [ ] Track active users (monitor API logs)
- [ ] Log support requests in GitHub Issues
- [ ] Plan hotfixes if critical bugs found

## Post-Release Monitoring

- [ ] APK download count (Cloudflare Analytics)
- [ ] User registration rate (API metrics)
- [ ] API error logs (check for crashes)
- [ ] User retention (daily/weekly active users)
- [ ] Performance metrics (API response times)

## Hotfix Process (if needed)

1. Create hotfix branch: `git checkout -b hotfix/v0.1.1`
2. Fix critical bug (not adding features)
3. Update versionCode in build.gradle
4. Commit: `git commit -m "Fix: critical issue"`
5. Tag: `git tag -a v0.1.1 -m "Critical hotfix"`
6. Push: `git push origin hotfix/v0.1.1 --tags`
7. Merge back to main: `git checkout main && git merge hotfix/v0.1.1`

## Security Considerations

- [ ] All APKs signed with same keystore
- [ ] Keystore password NOT in GitHub/logs
- [ ] R2 bucket private (require authentication)
- [ ] HTTPS-only distribution
- [ ] SHA-256 checksums published
- [ ] Version numbers always increment
- [ ] No beta/test keystore used in production

## Archive & Retention

- Keep all keystores and passwords in password manager
- Archive old APKs in versioned Cloudflare R2 folder structure
- Document version history in CHANGELOG.md
- Keep GitHub releases for historical reference

## Rollback Plan (Emergency)

If v0.2 has critical bug:

1. Download previous v0.1.apk from R2
2. Re-upload to replace v0.2 (if needed)
3. Notify users of rollback via WhatsApp
4. Create GitHub issue documenting the problem
5. Plan fix for v0.2.1

---

**Last Updated:** January 9, 2026
**Version:** 1.0
**Maintained By:** DinApp Dev Team

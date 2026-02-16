# Release & Code Signing

## GitHub Secrets

The release workflow requires these secrets. Set them at the **org level** to share across repos.

| Secret | Description |
|--------|-------------|
| `APPLE_CERTIFICATE` | Base64-encoded .p12 Developer ID Application certificate |
| `APPLE_CERTIFICATE_PASSWORD` | Password used when exporting the .p12 |
| `APPLE_ID` | Apple ID email for notarization |
| `APPLE_PASSWORD` | App-specific password for notarization |
| `TAURI_SIGNING_PRIVATE_KEY` | Tauri updater signing key |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Tauri updater signing key password |

The signing identity and team ID are extracted from the certificate automatically at build time.

## Setup

### 1. Export the certificate

Open **Keychain Access** and find your "Developer ID Application" certificate.

```bash
# Right-click > Export... > save as cert.p12
# Then base64 encode it:
base64 -i cert.p12 | pbcopy
```

Paste the result as the `APPLE_CERTIFICATE` secret.

### 2. Create an app-specific password

1. Go to [appleid.apple.com](https://appleid.apple.com) > Sign-In and Security > App-Specific Passwords
2. Generate a new password
3. Save it as the `APPLE_PASSWORD` secret

### 3. Generate Tauri updater keys

```bash
bunx tauri signer generate -w ~/.tauri/skillpad.key
```

Save the private key as `TAURI_SIGNING_PRIVATE_KEY` and the password as `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.

## Running a release

```bash
# Trigger via GitHub Actions UI or CLI:
gh workflow run release.yml -f version=0.2.0
```

This will:
1. Bump version in package.json, tauri.conf.json, and Cargo.toml
2. Build for macOS (universal binary, signed + notarized) and Windows
3. Create a GitHub release with the artifacts

# V4 Migration

- Replace `Context` to `Box`.
- Resolve errors if the same id was used in an action chain.
- Convert `auth`:
  - `auth` is now a root level property.
  - remove `openId` fields.
  - add providers:
  ```yaml
  providers:
    - id: auth0
      type: Auth0Provider
      properties:
        clientId:
          _secret: AUTH0_CLIENT_ID
        clientSecret:
          _secret: AUTH0_CLIENT_SECRET
        issuer:
          _secret: AUTH0_ISSUER
  ```
  - Add env vars `NEXTAUTH_URL` and `NEXTAUTH_SECRET`.
  - Add new callback urls to auth0 `{{ protocol }}{{ host }}/api/auth/callback/{{ providerId }}`.
- Convert types to plugins.
- Replace `onEnter` and `onEnterAsync` with `onMount` and `onMountAsync`.
- Convert old loading on blocks to new loading.
- Convert all request operators except `_user`, to use `_payload`.
- Lowdefy V3 set some Ant Design theme variables, since the theme variables could not be configured. These variables are no longer set. To use the old theme set:

```yaml
config:
  theme:
    '@primary-color': '#697a8c'
    '@link-color': '#1890ff'
    '@layout-header-background': '#30383f'
    '@layout-sider-background': '#30383f'
    '@menu-dark-submenu-bg': '#21262b'
```

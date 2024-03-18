export  const input = `
openapi: "3.0.0"
info:
  title: FreJun API Documentation
  version: "1.0"
servers:
  - url: "https://api.frejun.com/api/v1"
paths:  
  /oauth/token/:
    get:
      summary: Obtain Access token
      parameters:
        - name: code
          in: query
          description: Authorization code obtained from OAuth process
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Successfully generated access and refresh tokens
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
                  access_token:
                    type: string
                  refresh_token:
                    type: string
                  expires_in:
                    type: number
                  token_type:
                    type: string
        "400":
          description: Invalid code
        "401":
          description: Access code has expired
        "403":
          description: You don't have enough permissions
        "500":
          description: Something went wrong. Please contact FreJun
  /oauth/token/refresh/:
    post:
      summary: Refresh Access token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                refresh:
                  type: string
      responses:
        "200":
          description: Successfully generated new access and refresh tokens
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
                  access_token:
                    type: string
                  refresh_token:
                    type: string
                  expires_in:
                    type: number
        "400":
          description: Missing necessary parameters
        "401":
          description: Refresh token has been revoked or Token is invalid or expired
        "403":
          description: You don't have permission to get tokens for this account
        "500":
          description: Something went wrong. Please contact FreJun
  /oauth/verify-token/:
    post:
      summary: Verify Token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                token:
                  type: string
      responses:
        "200":
          description: Token is valid
        "401":
          description: Token is invalid or expired
          content:
            application/json:
              schema:
                type: object
                properties:
                  detail:
                    type: string
                  code:
                    type: string
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

`

export const input2 = `
{"ff":"dd"}
`
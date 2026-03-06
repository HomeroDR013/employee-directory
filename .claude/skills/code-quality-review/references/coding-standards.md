# Coding Standards — Employee Directory

## Architecture
- Features follow: domain/ → data/ → presentation/
- Types go in domain/, API slices in data/, components in presentation/
- No cross-feature imports (each feature is self-contained)

## RTK Query
- Every API slice must define `tagTypes`
- GET endpoints must use `providesTags`
- Mutation endpoints must use `invalidatesTags`
- Use proper TypeScript generics: `build.query<ResponseType, ArgType>`
- Base URL configured in a central apiSlice, features use `injectEndpoints`

## React Hook Form + Zod
- All forms must use `zodResolver` for validation
- Zod schemas defined alongside the form component or in domain/
- Error messages displayed per-field, not as a global alert
- Form submit must handle loading and error states

## TypeScript
- No `any` type — use `unknown` if type is truly unknown
- Interfaces for domain entities go in domain/*.types.ts
- Props interfaces defined in the same file as the component
- Prefer `interface` over `type` for object shapes

## Components
- Pages go in presentation/pages/
- Reusable components go in presentation/components/
- Each component in its own file
- Loading and error states handled in every page component

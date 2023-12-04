# xattr binding for Deno

## Example

```ts
$ deno --unstable
> import * as xa from "https://denopkg.com/xubaiw/deno-xattr/mod.ts";
> await xa.setxattr("a.txt", "user.xdg.comment", "Some comment");
true
> await xa.listxattr("a.txt")
[ "user.xdg.comment" ]
> await xa.getxattr("a.txt", "user.xdg.comment")
"Some comment"
```

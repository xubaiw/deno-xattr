const LIBC = Deno.dlopen("/usr/lib/libc.so.6", {
  setxattr: {
    parameters: ["buffer", "buffer", "buffer", "usize", "i32"],
    result: "i32",
    nonblocking: true,
  },
  lsetxattr: {
    parameters: ["buffer", "buffer", "buffer", "usize", "i32"],
    result: "i32",
    nonblocking: true,
  },
  getxattr: {
    parameters: ["buffer", "buffer", "buffer", "usize"],
    result: "usize",
    nonblocking: true,
  },
  lgetxattr: {
    parameters: ["buffer", "buffer", "buffer", "usize"],
    result: "usize",
    nonblocking: true,
  },
  listxattr: {
    parameters: ["buffer", "buffer", "usize"],
    result: "usize",
    nonblocking: true,
  },
  llistxattr: {
    parameters: ["buffer", "buffer", "usize"],
    result: "usize",
    nonblocking: true,
  },
  removexattr: {
    parameters: ["buffer", "buffer"],
    result: "i32",
    nonblocking: true,
  },
  lremovexattr: {
    parameters: ["buffer", "buffer"],
    result: "i32",
    nonblocking: true,
  },
});

function encode(s: string, zero = true) {
  return new TextEncoder().encode(s + (zero ? "\0" : ""));
}

/**
 * @param path - path to the file
 * @param name - name of the attribute
 * @param value - value of the attribute
 * @returns success or not
 */
export async function setxattr(
  path: string,
  name: string,
  value: string,
): Promise<boolean> {
  const [pb, nb] = [path, name].map((x) => encode(x));
  const vb = encode(value, false);
  const ret = await LIBC.symbols.setxattr(pb, nb, vb, vb.length, 0);
  return ret == 0;
}

/**
 * @param path - path to the file
 * @param name - name of the attribute
 * @param value - value of the attribute
 * @returns success or not
 */
export async function lsetxattr(
  path: string,
  name: string,
  value: string,
): Promise<boolean> {
  const [pb, nb] = [path, name].map((x) => encode(x));
  const vb = encode(value, false);
  const ret = await LIBC.symbols.lsetxattr(pb, nb, vb, vb.length, 0);
  return ret == 0;
}

/**
 * @param path - path to the file
 * @param name - name of the attribute
 * @returns value or null (error)
 */
export async function getxattr(
  path: string,
  name: string,
): Promise<string | null> {
  const [pb, nb] = [path, name].map((x) => encode(x));
  const size = Number(await LIBC.symbols.getxattr(pb, nb, null, 0));
  if (size < 0) return null;
  try {
    const buffer = new Uint8Array(size);
    const ret = await LIBC.symbols.getxattr(pb, nb, buffer, size);
    if (ret < 0) return null;
    return new TextDecoder().decode(buffer);
  } catch {
    return null;
  }
}

/**
 * @param path - path to the file
 * @param name - name of the attribute
 * @returns value or null (error)
 */
export async function lgetxattr(
  path: string,
  name: string,
): Promise<string | null> {
  const [pb, nb] = [path, name].map((x) => encode(x));
  const size = Number(await LIBC.symbols.lgetxattr(pb, nb, null, 0));
  if (size < 0) return null;
  try {
    const buffer = new Uint8Array(size);
    const ret = await LIBC.symbols.lgetxattr(pb, nb, buffer, size);
    if (ret < 0) return null;
    return new TextDecoder().decode(buffer);
  } catch {
    return null;
  }
}

/**
 * @param path - path to the file
 * @returns array of attribute names or null (error)
 */
export async function listxattr(
  path: string,
): Promise<string[] | null> {
  const pb = encode(path);
  const size = await LIBC.symbols.listxattr(pb, null, 0);
  if (size < 0) return null;
  const buffer = new Uint8Array(Number(size));
  const ret = await LIBC.symbols.listxattr(pb, buffer, size);
  if (ret < 0) return null;
  const list = new TextDecoder().decode(buffer).split("\0");
  list.pop();
  return list;
}

/**
 * @param path - path to the file
 * @returns array of attribute names or null (error)
 */
export async function llistxattr(
  path: string,
): Promise<string[] | null> {
  const pb = encode(path);
  const size = await LIBC.symbols.listxattr(pb, null, 0);
  if (size < 0) return null;
  const buffer = new Uint8Array(Number(size));
  const ret = await LIBC.symbols.llistxattr(pb, buffer, size);
  if (ret < 0) return null;
  const list = new TextDecoder().decode(buffer).split("\0");
  list.pop();
  return list;
}

/**
 * @param path - path to the file
 * @param name - name of the attribute
 * @returns success or not
 */
export async function removexattr(
  path: string,
  name: string,
): Promise<boolean> {
  const [pb, nb] = [path, name].map((x) => encode(x));
  const ret = await LIBC.symbols.removexattr(pb, nb);
  return ret == 0;
}

/**
 * @param path - path to the file
 * @param name - name of the attribute
 * @returns success or not
 */
export async function lremovexattr(
  path: string,
  name: string,
): Promise<boolean> {
  const [pb, nb] = [path, name].map((x) => encode(x));
  const ret = await LIBC.symbols.lremovexattr(pb, nb);
  return ret == 0;
}

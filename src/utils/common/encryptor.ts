import JSEncrypt from 'jsencrypt';
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCNpnwVvcShyKczBHr5U/N2SoGoYhfisylXJsN0bsm2k1NjF9ldwa7q2R8ohR7EAJU+8/SMCHUhAllHmCjQR8xZEc/MWvrTJk3FMo7/GiCKUfAlfIpdL3rdWyOXZ/VcvwAr2gbDrC29qyOYSz113Rll9WDVN1yZME2FZlNtCurO4wIDAQAB';
export default {
  // 加密
  encrypt(txt) {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey); // 设置公钥
    return encryptor.encrypt(txt); // 对需要加密的数据进行加密
  },
  // 解密
  decrypt(txt) {
    const encryptor = new JSEncrypt();
    encryptor.setPrivateKey('MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAI2mfBW9xKHIpzMEevlT83ZKgahiF+KzKVcmw3RuybaTU2MX2V3BrurZHyiFHsQAlT7z9IwIdSECWUeYKNBHzFkRz8xa+tMmTcUyjv8aIIpR8CV8il0vet1bI5dn9Vy/ACvaBsOsLb2rI5hLPXXdGWX1YNU3XJkwTYVmU20K6s7jAgMBAAECgYA5iBb51ZuZgh+2rukrfxdxQg2rUDwXTWFLDmlwTtcKmofRxYv5coMSy6DGGltGjF4RtY/rmDvKbmPImlppTeAG6kHUjzwxkaDblFlSDm3fkVXyZJtiDmjUIBDdBBboOXH+467vALYBE6bTK7gKXbj+W+339yqowT3EDLGyeIM4wQJBALWHocpWYbSLRpVM/rjQE0VXoBd2Lu4w787q7TpYICjpadO2NcVMFxuygNCKJl+Ep92dpD+qMKlL/hRb5xVzDJMCQQDHwq+fitVfWP9mpAUJlWxEExIOSs1P5iGNBQvr/Bnm6aX7pBEH79kh+cmmGjeuBWvG5RqRJggBrrWEuxNL3/ZxAkB8f3f7wECkRTz0Wmj8MWB2F0GptZk8LP3bKI3ojNYJmQPGelnoZWYXzdXAsG7e5akHOf2S2FMlWQP5zInw0QXXAkBaxjByam9dnZ6psL0NRtZk9NmOnxU/So9SesmZGf1XPjOL71lB5w8fblfg4CcPMC1yu2dgMA0RXqfjwfMZ1pMxAkEAotKmtUm6sFq8YsA1hRuzEgVRfNnMP98RNvz6I2t9l0tHP+YPjybBeK8R9KIZsNsYOebdwCBxLdYK1fpW9WXYFA==');
    return encryptor.decrypt(txt);
  },
};

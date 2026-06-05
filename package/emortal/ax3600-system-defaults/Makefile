# SPDX-License-Identifier: GPL-2.0-only

include $(TOPDIR)/rules.mk

PKG_NAME:=ax3600-system-defaults
PKG_RELEASE:=2

PKG_LICENSE:=GPL-2.0-only

include $(INCLUDE_DIR)/package.mk

define Package/ax3600-system-defaults
  SECTION:=base
  CATEGORY:=Base system
  TITLE:=AX3600 NSS-safe system defaults
  DEPENDS:=@(TARGET_qualcommax_ipq807x_DEVICE_xiaomi_ax3600||TARGET_qualcommax_ipq807x_DEVICE_xiaomi_ax3600-stock)
  PKGARCH:=all
endef

define Build/Compile
endef

define Package/ax3600-system-defaults/install
	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_BIN) ./files/95-ax3600-nss-defaults $(1)/etc/uci-defaults/
endef

$(eval $(call BuildPackage,ax3600-system-defaults))

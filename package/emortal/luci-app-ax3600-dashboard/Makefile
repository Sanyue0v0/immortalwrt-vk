# SPDX-License-Identifier: Apache-2.0

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-ax3600-dashboard
PKG_RELEASE:=1

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=ImmortalWrt IPQ build profile

LUCI_TITLE:=AX3600 dashboard polish for LuCI
LUCI_DEPENDS:=+luci-base +luci-mod-dashboard +luci-app-turboacc
LUCI_PKGARCH:=all

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature

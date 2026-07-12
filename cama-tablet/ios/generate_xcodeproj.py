#!/usr/bin/env python3
from pathlib import Path
import uuid

root = Path("/Users/happycog/project/cama-cafe24/cama-tablet/ios")
proj = root / "CamaTablet.xcodeproj"
proj.mkdir(exist_ok=True)

def gid(name: str) -> str:
    return uuid.uuid5(uuid.NAMESPACE_URL, f"cama-tablet-ios:{name}").hex[:24].upper()

files = [
    ("AppDelegate.swift", "sourcecode.swift"),
    ("ViewController.swift", "sourcecode.swift"),
    ("CamaTabletLog.swift", "sourcecode.swift"),
    ("Bridge/NativeEventEmitter.swift", "sourcecode.swift"),
    ("Bridge/LocalWWWSchemeHandler.swift", "sourcecode.swift"),
    ("BLE/BleConstants.swift", "sourcecode.swift"),
    ("BLE/TabletDeviceInfo.swift", "sourcecode.swift"),
    ("BLE/BleGattServerManager.swift", "sourcecode.swift"),
    ("Info.plist", "text.plist.xml"),
    ("Assets.xcassets", "folder.assetcatalog"),
]

ids = {name: gid(name) for name, _ in files}
for key in [
    "www", "project", "target", "sources", "resources", "frameworks", "product",
    "main_group", "cama_group", "bridge_group", "ble_group", "products_group",
    "config_list_project", "config_list_target",
    "debug_project", "release_project", "debug_target", "release_target",
]:
    ids[key] = gid(key)

source_names = [n for n, _ in files if n.endswith(".swift")]
resource_names = ["Assets.xcassets", "www"]
build_files = {n: gid(f"build:{n}") for n in source_names + resource_names}

nl = "\n"
bf_lines = []
for name in source_names:
    bf_lines.append(
        f"\t\t{build_files[name]} /* {Path(name).name} in Sources */ = "
        f"{{isa = PBXBuildFile; fileRef = {ids[name]} /* {Path(name).name} */; }};"
    )
for name in resource_names:
    bf_lines.append(
        f"\t\t{build_files[name]} /* {Path(name).name} in Resources */ = "
        f"{{isa = PBXBuildFile; fileRef = {ids[name]} /* {Path(name).name} */; }};"
    )

fr_lines = []
for name, ftype in files:
    fr_lines.append(
        f"\t\t{ids[name]} /* {Path(name).name} */ = {{isa = PBXFileReference; "
        f"lastKnownFileType = {ftype}; path = {Path(name).name}; sourceTree = \"<group>\"; }};"
    )
fr_lines.append(
    f"\t\t{ids['www']} /* www */ = {{isa = PBXFileReference; lastKnownFileType = folder; "
    f"name = www; path = Resources/www; sourceTree = \"<group>\"; }};"
)
fr_lines.append(
    f"\t\t{ids['product']} /* CamaTablet.app */ = {{isa = PBXFileReference; "
    f"explicitFileType = wrapper.application; includeInIndex = 0; path = CamaTablet.app; "
    f"sourceTree = BUILT_PRODUCTS_DIR; }};"
)

source_build = nl.join(
    f"\t\t\t\t{build_files[n]} /* {Path(n).name} in Sources */," for n in source_names
)

pbx = f"""// !$*UTF8*$!
{{
	archiveVersion = 1;
	classes = {{
	}};
	objectVersion = 56;
	objects = {{

/* Begin PBXBuildFile section */
{nl.join(bf_lines)}
/* End PBXBuildFile section */

/* Begin PBXFileReference section */
{nl.join(fr_lines)}
/* End PBXFileReference section */

/* Begin PBXFrameworksBuildPhase section */
		{ids['frameworks']} /* Frameworks */ = {{
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
/* End PBXFrameworksBuildPhase section */

/* Begin PBXGroup section */
		{ids['main_group']} = {{
			isa = PBXGroup;
			children = (
				{ids['cama_group']} /* CamaTablet */,
				{ids['products_group']} /* Products */,
			);
			sourceTree = "<group>";
		}};
		{ids['products_group']} /* Products */ = {{
			isa = PBXGroup;
			children = (
				{ids['product']} /* CamaTablet.app */,
			);
			name = Products;
			sourceTree = "<group>";
		}};
		{ids['cama_group']} /* CamaTablet */ = {{
			isa = PBXGroup;
			children = (
				{ids['AppDelegate.swift']} /* AppDelegate.swift */,
				{ids['ViewController.swift']} /* ViewController.swift */,
				{ids['CamaTabletLog.swift']} /* CamaTabletLog.swift */,
				{ids['bridge_group']} /* Bridge */,
				{ids['ble_group']} /* BLE */,
				{ids['www']} /* www */,
				{ids['Assets.xcassets']} /* Assets.xcassets */,
				{ids['Info.plist']} /* Info.plist */,
			);
			path = CamaTablet;
			sourceTree = "<group>";
		}};
		{ids['bridge_group']} /* Bridge */ = {{
			isa = PBXGroup;
			children = (
				{ids['Bridge/NativeEventEmitter.swift']} /* NativeEventEmitter.swift */,
				{ids['Bridge/LocalWWWSchemeHandler.swift']} /* LocalWWWSchemeHandler.swift */,
			);
			path = Bridge;
			sourceTree = "<group>";
		}};
		{ids['ble_group']} /* BLE */ = {{
			isa = PBXGroup;
			children = (
				{ids['BLE/BleConstants.swift']} /* BleConstants.swift */,
				{ids['BLE/TabletDeviceInfo.swift']} /* TabletDeviceInfo.swift */,
				{ids['BLE/BleGattServerManager.swift']} /* BleGattServerManager.swift */,
			);
			path = BLE;
			sourceTree = "<group>";
		}};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		{ids['target']} /* CamaTablet */ = {{
			isa = PBXNativeTarget;
			buildConfigurationList = {ids['config_list_target']} /* Build configuration list for PBXNativeTarget "CamaTablet" */;
			buildPhases = (
				{ids['sources']} /* Sources */,
				{ids['frameworks']} /* Frameworks */,
				{ids['resources']} /* Resources */,
			);
			buildRules = (
			);
			dependencies = (
			);
			name = CamaTablet;
			productName = CamaTablet;
			productReference = {ids['product']} /* CamaTablet.app */;
			productType = "com.apple.product-type.application";
		}};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		{ids['project']} /* Project object */ = {{
			isa = PBXProject;
			attributes = {{
				BuildIndependentTargetsInParallel = 1;
				LastSwiftUpdateCheck = 1600;
				LastUpgradeCheck = 1600;
				TargetAttributes = {{
					{ids['target']} = {{
						CreatedOnToolsVersion = 16.0;
					}};
				}};
			}};
			buildConfigurationList = {ids['config_list_project']} /* Build configuration list for PBXProject "CamaTablet" */;
			compatibilityVersion = "Xcode 14.0";
			developmentRegion = ko;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
				ko,
				Base,
			);
			mainGroup = {ids['main_group']};
			productRefGroup = {ids['products_group']} /* Products */;
			projectDirPath = "";
			projectRoot = "";
			targets = (
				{ids['target']} /* CamaTablet */,
			);
		}};
/* End PBXProject section */

/* Begin PBXResourcesBuildPhase section */
		{ids['resources']} /* Resources */ = {{
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				{build_files['Assets.xcassets']} /* Assets.xcassets in Resources */,
				{build_files['www']} /* www in Resources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
/* End PBXResourcesBuildPhase section */

/* Begin PBXSourcesBuildPhase section */
		{ids['sources']} /* Sources */ = {{
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
{source_build}
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
/* End PBXSourcesBuildPhase section */

/* Begin XCBuildConfiguration section */
		{ids['debug_project']} /* Debug */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = dwarf;
				ENABLE_TESTABILITY = YES;
				GCC_DYNAMIC_NO_PIC = NO;
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				ONLY_ACTIVE_ARCH = YES;
				SDKROOT = iphoneos;
				SWIFT_ACTIVE_COMPILATION_CONDITIONS = DEBUG;
				SWIFT_OPTIMIZATION_LEVEL = "-Onone";
			}};
			name = Debug;
		}};
		{ids['release_project']} /* Release */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				SDKROOT = iphoneos;
				SWIFT_COMPILATION_MODE = wholemodule;
				VALIDATE_PRODUCT = YES;
			}};
			name = Release;
		}};
		{ids['debug_target']} /* Debug */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 4;
				DEVELOPMENT_TEAM = VHDAUYTQX3;
				GENERATE_INFOPLIST_FILE = NO;
				INFOPLIST_FILE = CamaTablet/Info.plist;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0.3;
				PRODUCT_BUNDLE_IDENTIFIER = com.cama.tablet.offline;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SUPPORTED_PLATFORMS = "iphoneos iphonesimulator";
				SUPPORTS_MACCATALYST = NO;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			}};
			name = Debug;
		}};
		{ids['release_target']} /* Release */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 4;
				DEVELOPMENT_TEAM = VHDAUYTQX3;
				GENERATE_INFOPLIST_FILE = NO;
				INFOPLIST_FILE = CamaTablet/Info.plist;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0.3;
				PRODUCT_BUNDLE_IDENTIFIER = com.cama.tablet.offline;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SUPPORTED_PLATFORMS = "iphoneos iphonesimulator";
				SUPPORTS_MACCATALYST = NO;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			}};
			name = Release;
		}};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		{ids['config_list_project']} /* Build configuration list for PBXProject "CamaTablet" */ = {{
			isa = XCConfigurationList;
			buildConfigurations = (
				{ids['debug_project']} /* Debug */,
				{ids['release_project']} /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		}};
		{ids['config_list_target']} /* Build configuration list for PBXNativeTarget "CamaTablet" */ = {{
			isa = XCConfigurationList;
			buildConfigurations = (
				{ids['debug_target']} /* Debug */,
				{ids['release_target']} /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		}};
/* End XCConfigurationList section */
	}};
	rootObject = {ids['project']} /* Project object */;
}}
"""

(proj / "project.pbxproj").write_text(pbx)
print("Wrote", proj / "project.pbxproj")

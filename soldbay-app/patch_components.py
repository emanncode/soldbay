import os

def replace_in_file(filepath, old_text, new_text):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if old_text in content:
        content = content.replace(old_text, new_text)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Warning: Text not found in {filepath}")

# 1. TabBar.tsx
tabbar_path = 'src/components/ui/TabBar.tsx'
replace_in_file(
    tabbar_path,
    ": (isDark ? colors.borderDark : colors.borderLight);",
    ": (isDark ? colors.borderDark : colors.secondaryText);"
)
replace_in_file(
    tabbar_path,
    "<Text className={`text-caption-1 ${isFocused ? 'text-accent' : 'text-borderLight dark:text-borderDark'}`}>",
    "<Text className={`text-caption-1 ${isFocused ? 'text-accent' : 'text-secondaryText dark:text-borderDark'}`}>"
)

# 2. SearchBar.tsx
searchbar_path = 'src/components/ui/SearchBar.tsx'
replace_in_file(
    searchbar_path,
    "const iconColor = isDark ? colors.borderDark : colors.borderLight;",
    "const iconColor = isDark ? colors.borderDark : colors.secondaryText;"
)

# 3. ProductCard.tsx
productcard_path = 'src/components/ui/ProductCard.tsx'
replace_in_file(
    productcard_path,
    "const borderClass = 'border border-primaryText/10 dark:border-borderDark/10';",
    "const borderClass = 'border border-primaryText/10 dark:border-borderDark/24';"
)


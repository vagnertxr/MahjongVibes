#include <windows.h>
#include <shellapi.h>

static void dirname_in_place(wchar_t *path) {
    wchar_t *last_slash = 0;
    for (wchar_t *p = path; *p; ++p) {
        if (*p == L'\\' || *p == L'/') {
            last_slash = p;
        }
    }
    if (last_slash) {
        *last_slash = 0;
    }
}

int WINAPI wWinMain(HINSTANCE instance, HINSTANCE previous, PWSTR command_line, int show_command) {
    (void)instance;
    (void)previous;
    (void)command_line;
    (void)show_command;

    wchar_t exe_path[MAX_PATH];
    wchar_t app_dir[MAX_PATH];
    wchar_t index_path[MAX_PATH];

    if (!GetModuleFileNameW(NULL, exe_path, MAX_PATH)) {
        MessageBoxW(NULL, L"Could not locate Mahjong Vibes.exe.", L"Mahjong Vibes", MB_ICONERROR);
        return 1;
    }

    lstrcpyW(app_dir, exe_path);
    dirname_in_place(app_dir);
    wsprintfW(index_path, L"%s\\index.html", app_dir);

    HINSTANCE result = ShellExecuteW(NULL, L"open", index_path, NULL, app_dir, SW_SHOWNORMAL);
    if ((INT_PTR)result <= 32) {
        MessageBoxW(NULL, L"Could not open index.html next to Mahjong Vibes.exe.", L"Mahjong Vibes", MB_ICONERROR);
        return 1;
    }

    return 0;
}

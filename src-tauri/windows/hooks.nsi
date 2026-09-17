; src-tauri/windows/hooks.nsi
!macro NSIS_HOOK_POSTINSTALL
    WriteRegStr SHCTX "Software\Classes\.glh\DefaultIcon" "" "$INSTDIR\icons\glh-file-icon.ico,0"
    System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, i 0, i 0)'
!macroend
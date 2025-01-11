# Create core directory structure
New-Item -ItemType Directory -Force -Path "src/app/core/services"
New-Item -ItemType Directory -Force -Path "src/app/core/models"
New-Item -ItemType Directory -Force -Path "src/app/core/interfaces"
New-Item -ItemType Directory -Force -Path "src/app/features/editor/components/tree-view"
New-Item -ItemType Directory -Force -Path "src/app/features/editor/components/preview"
New-Item -ItemType Directory -Force -Path "src/app/features/editor/components/toolbar"
New-Item -ItemType Directory -Force -Path "src/app/shared"
New-Item -ItemType Directory -Force -Path "test/css-samples"
New-Item -ItemType Directory -Force -Path "test/unit"
New-Item -ItemType Directory -Force -Path "test/integration"

# Create core service files
$serviceFiles = @(
    "src/app/core/services/css-parser.service.ts",
    "src/app/core/services/ast-builder.service.ts",
    "src/app/core/services/ast-generator.service.ts",
    "src/app/core/services/tree-manager.service.ts",
    "src/app/core/services/preview.service.ts"
)
foreach ($file in $serviceFiles) {
    New-Item -ItemType File -Force -Path $file
}

# Create core model files
$modelFiles = @(
    "src/app/core/models/postcss-ast.model.ts",
    "src/app/core/models/editor-tree.model.ts",
    "src/app/core/models/transformers.model.ts"
)
foreach ($file in $modelFiles) {
    New-Item -ItemType File -Force -Path $file
}

# Create core interface files
$interfaceFiles = @(
    "src/app/core/interfaces/parser.interfaces.ts",
    "src/app/core/interfaces/tree.interfaces.ts"
)
foreach ($file in $interfaceFiles) {
    New-Item -ItemType File -Force -Path $file
}

# Create feature module and component files
New-Item -ItemType File -Force -Path "src/app/features/editor/editor.module.ts"

# Create component files
$componentSets = @(
    "src/app/features/editor/components/tree-view/tree-view.component",
    "src/app/features/editor/components/preview/preview.component",
    "src/app/features/editor/components/toolbar/toolbar.component"
)
foreach ($baseFile in $componentSets) {
    New-Item -ItemType File -Force -Path "$baseFile.ts"
    New-Item -ItemType File -Force -Path "$baseFile.html"
    New-Item -ItemType File -Force -Path "$baseFile.scss"
}

# Create test files
New-Item -ItemType File -Force -Path "test/parser.spec.ts"
New-Item -ItemType File -Force -Path "test/ast-transformations.spec.ts"

Write-Host "Directory structure and files created successfully!"
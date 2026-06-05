import { useRef, useState, DragEvent } from 'react'
import { Box, Typography, IconButton, Paper, Chip, Dialog, DialogContent, useTheme } from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import CloseIcon from '@mui/icons-material/Close'

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  /** base64 data URL */
  url: string
}

interface FileUploaderProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  accept?: string
  maxFiles?: number
  label?: string
  compact?: boolean
}

/**
 * Componente compartido de carga de archivos.
 * - Drag & drop funcional
 * - Preview de imágenes en grid con lightbox
 * - Chips para PDFs
 * - Almacena como base64 para persistencia en Redux
 */
export function FileUploader({
  files,
  onFilesChange,
  accept = 'image/jpeg,image/png,image/webp,application/pdf',
  maxFiles = 10,
  label = 'Arrastra archivos aquí o haz clic para seleccionar',
  compact = false,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  const readAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const processFiles = async (rawFiles: FileList) => {
    const remaining = maxFiles - files.length
    const toAdd = Array.from(rawFiles).slice(0, remaining)
    const newFiles: UploadedFile[] = await Promise.all(
      toAdd.map(async (f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}-${f.name}`,
        name: f.name,
        size: f.size,
        type: f.type,
        url: await readAsBase64(f),
      }))
    )
    onFilesChange([...files, ...newFiles])
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files)
  }

  const handleRemove = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <Box>
      {/* Drop zone */}
      <Paper
        variant="outlined"
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        sx={{
          p: compact ? 2 : 3.5,
          textAlign: 'center',
          cursor: 'pointer',
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: dragging ? '#2563EB' : (isLight ? '#CBD5E1' : '#334155'),
          backgroundColor: dragging
            ? 'rgba(37,99,235,0.04)'
            : (isLight ? '#FAFBFD' : 'rgba(30,41,59,0.5)'),
          borderRadius: '12px',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37,99,235,0.03)',
          },
        }}
      >
        <CloudUploadOutlinedIcon
          sx={{
            fontSize: compact ? 28 : 40,
            color: dragging ? '#2563EB' : '#94A3B8',
            mb: 1,
            transition: 'color 0.2s',
          }}
        />
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ color: dragging ? '#2563EB' : 'text.secondary' }}
        >
          {label}
        </Typography>
        {!compact && (
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.5 }}>
            JPG, PNG, PDF — Máximo {maxFiles} archivos
          </Typography>
        )}
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
          multiple
          onChange={(e) => { if (e.target.files) processFiles(e.target.files) }}
        />
      </Paper>

      {/* Preview */}
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {/* Imágenes en grid */}
          {files.some((f) => f.type.startsWith('image/')) && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: 1,
                mb: 1.5,
              }}
            >
              {files.filter((f) => f.type.startsWith('image/')).map((file) => (
                <Box
                  key={file.id}
                  sx={{
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    aspectRatio: '1',
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover .overlay': { opacity: 1 },
                  }}
                  onClick={() => setLightboxSrc(file.url)}
                >
                  <Box
                    component="img"
                    src={file.url}
                    alt={file.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Hover overlay */}
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(15,23,42,0.55)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <ZoomInIcon sx={{ color: 'white', fontSize: 22 }} />
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleRemove(file.id) }}
                      sx={{ color: 'white', p: 0.3 }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* PDFs como chips */}
          {files.filter((f) => !f.type.startsWith('image/')).map((file) => (
            <Chip
              key={file.id}
              icon={<InsertDriveFileOutlinedIcon />}
              label={`${file.name} (${formatSize(file.size)})`}
              onDelete={() => handleRemove(file.id)}
              size="small"
              variant="outlined"
              sx={{ mr: 0.75, mb: 0.75, maxWidth: 260, borderRadius: '8px' }}
            />
          ))}

          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
            {files.length} de {maxFiles} archivos
          </Typography>
        </Box>
      )}

      {/* Lightbox */}
      <Dialog
        open={Boolean(lightboxSrc)}
        onClose={() => setLightboxSrc(null)}
        maxWidth="lg"
        PaperProps={{ sx: { background: 'transparent', boxShadow: 'none', borderRadius: 0 } }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconButton
            onClick={() => setLightboxSrc(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.75)' },
            }}
          >
            <CloseIcon />
          </IconButton>
          {lightboxSrc && (
            <Box
              component="img"
              src={lightboxSrc}
              alt="Preview"
              sx={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 2, display: 'block' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

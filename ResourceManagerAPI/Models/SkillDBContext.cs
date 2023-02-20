using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ResourceManagerAPI.Models;

namespace ResourceManagerAPI.Models
{
    public partial class SkillDBContext : DbContext
    {
        public SkillDBContext(DbContextOptions<SkillDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Skills> skill { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Skills>(entity =>
            {

                entity.Property(e => e.ResourceName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.EmailID)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                //  entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.SkillGroup)
                      .HasMaxLength(250)
                      .IsUnicode(false);
                entity.Property(e => e.Skill)
                    .HasMaxLength(250)
                    .IsUnicode(false);
                entity.Property(e => e.MasterResourceUID)
                    .HasMaxLength(250)
                    .IsUnicode(false);
                entity.Property(e => e.SkillSetUID)
                   .HasMaxLength(250)
                   .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}